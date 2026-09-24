/**
 * A CMS entry as the page-text suites work with it (ticket 90): read what is
 * published, save a draft, publish, look at the draft in preview, open it in
 * the admin — and have the published version put back when the test ends,
 * pass or fail.
 *
 *   test('…', async ({ cms }) => {
 *     const home = cms.entry('home-page');
 *     const entry = await home.published();
 *     await home.draft({ ...entry, calculator: { ...entry.calculator, shows: false } });
 *     await cms.preview('/');
 *   });
 *
 * An entry is typed from `src/payload-types.ts`, which Payload writes from the
 * CMS's configuration: a field renamed there fails `npm run typecheck` in every
 * suite that names it, rather than a test run in each.
 *
 * Every request is made as the running suite's own editor, and one refused
 * for want of a session is made again (`editors.ts`).
 */
import { isDeepStrictEqual } from 'node:util';
import { test as base, expect, type APIResponse, type Page } from '@playwright/test';
import type { Config } from '../../src/payload-types';
import { ADMIN_PATH } from './cms';
import { signIn, signedIn, type SignedIn } from './editors';

export { expect };

/** A global's slug: every entry the CMS keeps one of. */
export type Slug = keyof Config['globals'];

/** What Payload adds to an entry and its list rows, which is not sent back. */
type Stored = 'id' | 'createdAt' | 'updatedAt' | 'globalType' | '_status';
const STORED: ReadonlySet<string> = new Set<Stored>(['id', 'createdAt', 'updatedAt', 'globalType', '_status']);

/**
 * A related document — an image, a sharing picture — which an entry read at
 * depth 0, as these are, holds as its id alone.
 */
type Related = { id: number; createdAt: string };

/** `T`'s fields alone, as they are read at depth 0 and sent back: no ids, no dates. */
export type Fields<T> = T extends readonly (infer Row)[]
  ? Fields<Row>[]
  : T extends object
    ? { [K in keyof T as K extends Stored ? never : K]: Fields<Exclude<T[K], Related>> }
    : T;

/** A global's entry, as `CmsEntry` reads and saves it. */
export type Entry<S extends Slug> = Fields<Config['globals'][S]>;

/** One kept version of an entry: its id, and the entry as it then stood. */
export type Version<S extends Slug> = { id: string; version: Entry<S> };

/** `value` with what Payload adds taken off, at every depth. */
export function fields<T>(value: T): Fields<T> {
  if (Array.isArray(value)) return value.map(fields) as Fields<T>;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !STORED.has(key))
        .map(([key, each]) => [key, fields(each)]),
    ) as Fields<T>;
  }
  return value as Fields<T>;
}

/**
 * One global, as the running suite's editor edits it.
 *
 * It remembers what was published the first time the test reads or changes
 * it, and keeps that however often it is read again, so that `restore` can
 * put back exactly that: a published change — through the adapter or through
 * the admin's own form — is undone by publishing what was there before, which
 * visitors see as they saw the change; a draft, by saving what was there
 * before as the draft, which visitors never see either way.
 */
export class CmsEntry<S extends Slug> {
  readonly slug: S;
  readonly #editor: SignedIn;
  #before: Entry<S> | undefined;
  #drafted = false;

  constructor(slug: S, editor: SignedIn) {
    this.slug = slug;
    this.#editor = editor;
  }

  get #address(): string {
    return `/api/globals/${this.slug}`;
  }

  /** The entry as published: what a visitor is shown. */
  async published(): Promise<Entry<S>> {
    const entry = await this.#read();
    this.#before ??= entry;
    return entry;
  }

  /** Saves `entry` as a draft, as the admin's Save Draft does. */
  async draft(entry: Entry<S>): Promise<void> {
    const response = await this.attempt(entry, 'draft');
    expect(response.ok(), `${this.slug} as a draft: ${await response.text()}`).toBe(true);
  }

  /**
   * Publishes `entry`, as the admin's Publish changes does. `timeout` is for
   * a publish the test expects to be held up (`stale-render.spec.ts`).
   */
  async publish(entry: Entry<S>, options: { timeout?: number } = {}): Promise<void> {
    const response = await this.attempt(entry, 'published', options);
    expect(response.ok(), `${this.slug} published: ${await response.text()}`).toBe(true);
  }

  /**
   * Sends `entry` to be saved, and hands back the answer whatever it is — for
   * a test that expects the CMS to refuse it.
   */
  async attempt(entry: Entry<S>, status: 'draft' | 'published', options: { timeout?: number } = {}): Promise<APIResponse> {
    await this.#remember();
    const response = await this.#editor.post(`${this.#address}${status === 'draft' ? '?draft=true' : ''}`, {
      data: { ...entry, _status: status },
      ...options,
    });
    // A publish leaves no draft behind it.
    if (response.ok()) this.#drafted = status === 'draft';
    return response;
  }

  /** The drafts kept of the entry, newest first. */
  async drafts(): Promise<Version<S>[]> {
    const response = await this.#editor.get(
      `${this.#address}/versions?where[version._status][equals]=draft&sort=-updatedAt&depth=0&limit=100`,
    );
    expect(response.ok(), `${this.slug}'s drafts: ${await response.text()}`).toBe(true);
    const { docs } = (await response.json()) as { docs: { id: string; version: Config['globals'][S] }[] };
    return docs.map(({ id, version }) => ({ id, version: fields(version) }));
  }

  /** Makes a kept version the draft, as restoring it from the admin's Versions does. */
  async restoreVersion(version: { id: string }): Promise<void> {
    await this.#remember();
    const made = await this.#editor.post(`${this.#address}/versions/${version.id}?draft=true`);
    expect(made.ok(), `${this.slug}'s version ${version.id} as the draft: ${await made.text()}`).toBe(true);
    this.#drafted = true;
  }

  /**
   * Puts back what this test changed: the entry as it was published before,
   * if what is published now is anything else; otherwise, if the test saved a
   * draft, the same entry saved as the draft over it — so that a test's draft
   * is not left waiting to be published by the next. Done for every entry
   * when the test ends; a test that has to see the entry put back calls it
   * itself.
   *
   * The draft is written from what the test read rather than by restoring
   * the newest published version from the entry's history. That history is
   * not always what is published: on CI the English pages' suite published
   * the closing section's English before this suite's test ran, and the
   * version found by date was an older one, without it. The English
   * partnership form's oldest published version is an empty one.
   */
  async restore(): Promise<void> {
    const before = this.#before;
    if (before === undefined) return;
    const published = !isDeepStrictEqual(await this.#read(), before);
    if (published || this.#drafted) {
      const status = published ? 'published' : 'draft';
      const response = await this.#editor.post(`${this.#address}${published ? '' : '?draft=true'}`, {
        data: { ...before, _status: status },
      });
      expect(response.ok(), `${this.slug} put back as ${status}: ${await response.text()}`).toBe(true);
    }
    this.#drafted = false;
  }

  async #read(): Promise<Entry<S>> {
    const response = await this.#editor.get(`${this.#address}?depth=0`);
    expect(response.ok(), `${this.slug}: ${await response.text()}`).toBe(true);
    return fields((await response.json()) as Config['globals'][S]);
  }

  /** What is published, read before the first change if the test has not read it itself. */
  async #remember(): Promise<void> {
    if (this.#before === undefined) await this.published();
  }
}

/**
 * Where the admin keeps which tab an editor last had open, inside that
 * entry's preference: the path of a page entry's tabs field, which is the
 * second field of every page global (`src/cms/page-globals.ts`) and has no
 * name of its own, so Payload calls it by its place.
 *
 * Restated here rather than worked out, for `routes.ts`'s reason. If Payload
 * ever names it something else, `openInAdmin` says so — the tab it asks the
 * admin to reopen is then never reopened, and the wait below fails.
 */
const TABS_FIELD_PATH = '_index-1';

/** How Payload marks the button of the tab it has open. */
const OPEN_TAB = /tabs-field__tab-button--active/;

/** A page entry's section tabs, in the order its sections are in. */
const SECTION_TABS = '.tabs-field__tabs .tabs-field__tab-button';

/**
 * A page entry open in the admin, with its section tabs ready to be clicked.
 *
 * Going there is not enough. The admin remembers which tab an editor had open
 * and restores it from a preference it fetches when the form mounts
 * (`@payloadcms/ui/fields/Tabs`, under the key `global-<slug>`): the answer,
 * whenever it lands, sets the open tab to the remembered one. A tab clicked
 * while that is still in flight is therefore set and then unset — the button
 * keeps the focus the click gave it, and the panel beside the tabs goes back
 * to another section's fields. That is what failed twice on CI as an
 * assertion that never found a switch (ticket 61), and holding that one
 * request up reproduces it every time, as `home-text.spec.ts` does.
 *
 * Waiting for the answer to arrive is not enough either: the admin acts on it
 * a render later, so a click in between is still lost. What is waited for
 * here is the restore itself, which this makes visible by telling the admin
 * first — through the same preference — that the second section is the one
 * this editor last had open. The entry then opens on its first section and
 * moves to its second, and that move is the restore, done. Nothing can undo a
 * click afterwards: the restore happens once, and from then on the admin
 * answers its own question out of what the clicks themselves have written.
 *
 * For entries of two sections or more, which is every page global but the
 * closing section's one.
 */
export class AdminEntry {
  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  static async open(page: Page, editor: SignedIn, slug: Slug): Promise<AdminEntry> {
    const remembered = await editor.post(`/api/payload-preferences/global-${slug}`, {
      data: { value: { fields: { [TABS_FIELD_PATH]: { tabIndex: 1 } } } },
    });
    expect(remembered.ok(), await remembered.text()).toBe(true);

    await page.goto(`${ADMIN_PATH}/globals/${slug}`);
    const second = page.locator(SECTION_TABS).nth(1);
    await expect(second, `the admin never reopened the second section of ${slug}, so the restore that undoes a click has still to come`).toHaveClass(
      OPEN_TAB,
    );
    return new AdminEntry(page);
  }

  /**
   * Opens one section, and leaves that section's own fields in the panel
   * beside the tabs.
   *
   * Clicking the tab is what an editor does; waiting for the panel to be this
   * section's is what tells the test it may read it. Without that, a test
   * reads whichever panel is there — the section it asked for, or the one the
   * admin put back (`open`), or one it opened earlier — and an assertion
   * about a section can pass on another section's fields.
   *
   * The panel itself is unnamed in the markup — every section's is
   * `tabs-field__tab` — so what is waited for is the tab whose panel it is:
   * Payload marks the open tab's button, and draws the panel of that one tab
   * and no other.
   */
  async openSection(name: string): Promise<void> {
    await this.#page.getByRole('button', { name, exact: true }).click();
    await this.expectSectionOpen(name);
  }

  /** That `name` is the section the admin has open, without asking it to open one. */
  async expectSectionOpen(name: string): Promise<void> {
    const tab = this.#page.getByRole('button', { name, exact: true });
    await expect(tab, `the ${name} section is not the one the admin has open`).toHaveClass(OPEN_TAB);
  }
}

/** What a test is handed as `cms`: the entries it edits, the preview, the admin — all as its suite's editor. */
export class Cms {
  readonly #page: Page;
  readonly #editor: SignedIn;
  readonly #entries = new Map<Slug, CmsEntry<Slug>>();

  constructor(page: Page) {
    this.#page = page;
    this.#editor = signedIn(page.request);
  }

  /** One global, the same object however often it is asked for, so that what it changes is put back once. */
  entry<S extends Slug>(slug: S): CmsEntry<S> {
    let entry = this.#entries.get(slug);
    if (!entry) this.#entries.set(slug, (entry = new CmsEntry<Slug>(slug, this.#editor)));
    return entry as unknown as CmsEntry<S>;
  }

  /** Opens the site in preview at `path`, as the admin's Preview button does: every entry's draft, drawn. */
  async preview(path: string): Promise<void> {
    await this.#page.goto(`/api/preview?path=${encodeURIComponent(path)}`);
    await expect(this.#page.getByRole('status')).toContainText('معاينة');
  }

  /** Opens a page entry in the admin, with its section tabs ready to be clicked (`AdminEntry`). */
  openInAdmin(slug: Slug): Promise<AdminEntry> {
    return AdminEntry.open(this.#page, this.#editor, slug);
  }

  /** Every entry put back, and the preview left. */
  async end(): Promise<void> {
    const outcomes = await Promise.allSettled([...this.#entries.values()].map((entry) => entry.restore()));
    await this.#page.request.get('/api/preview/exit');
    const failed = outcomes.find((outcome): outcome is PromiseRejectedResult => outcome.status === 'rejected');
    if (failed) throw failed.reason;
  }
}

/**
 * Playwright's `test`, with `cms`: the page's requests signed in as the
 * running suite's editor — the browser shares them, so the admin and the
 * preview open signed in — and every entry the test changed put back when it
 * ends, whether it passed or not. A test that only needs to be signed in, to
 * upload a picture say, asks for `cms` for that alone.
 */
export const test = base.extend<{ cms: Cms }>({
  cms: async ({ page }, use) => {
    await signIn(page.request);
    const cms = new Cms(page);
    await use(cms);
    await cms.end();
  },
});
