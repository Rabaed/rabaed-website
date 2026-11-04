/**
 * The Company profile's before-and-after section, `#compare` (ticket 108):
 * five tabs, each a question, a table and one of Ahmed's videos, which plays
 * by itself once it is on screen and fetches nothing before — unless the
 * visitor has asked for less motion or less data, when it waits for its
 * button. Every word is an Editor's, and so is each video and its poster.
 *
 * **Runs against the second test server**, one suite at a time, as the
 * profile's own suite does (`profile-page.spec.ts`): it drafts the profile's
 * entry, which that suite publishes.
 *
 * **Playwright's Chromium cannot play these videos**: it has no H.264
 * (`canPlayType('video/mp4; codecs="avc1.42E01E"')` answers `''`), and every
 * MP4 the site has is H.264. So what is asserted is what the page does, not
 * frames decoded: when a video's source is set and fetched, and whether the
 * page has it playing or paused. For the last, `pretendVideosPlay` stands in
 * for the browser's own `play` and `paused`, which in this browser could only
 * ever answer "refused" — it still calls the real `play`, so a source set is
 * a source fetched.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Page, Request } from '@playwright/test';
import { pictureFile } from './cms';
import { test, expect, type Entry } from './entries';
import { sidewaysOverflow, whatOverflows } from './geometry';
import { oneSuiteAtATime } from './one-suite-at-a-time';

test.describe.configure({ mode: 'default' });
oneSuiteAtATime(test);

type Profile = Entry<'profile-page'>;

/** Ahmed's five, in the order of their tabs, with the file each plays first. */
const COMPARISONS = [
  { module: 'الاعتمادات', question: 'إيش الملاحظات؟ أي نسخة؟ وعند مين الحين؟', video: '/profile/clips/01-approvals.mp4' },
  { module: 'المستندات', question: 'كم دقيقة حتى تصل إلى الملف؟', video: '/profile/clips/02-documents.mp4' },
  { module: 'المراسلات', question: 'لو ترك مدير المشروع العمل… أين يجد من بعده الخطابات؟', video: '/profile/clips/03-correspondence.mp4' },
  { module: 'لوحة المتابعة', question: 'والمهندس لم يجد وقتاً لتحديث الإكسل… هل الأرقام صحيحة؟', video: '/profile/clips/04-dashboard.mp4' },
  { module: 'التقرير اليومي', question: '«ماذا حدث اليوم في الموقع؟»', video: '/profile/clips/05-daily-report.mp4' },
] as const;

const PLAY = 'شغّل المقارنة';

const clips = path.resolve(import.meta.dirname, '..', '..', 'public', 'profile', 'clips');

const section = (page: Page) => page.locator('section#compare');
const tab = (page: Page, index: number) => page.locator(`#compare-tab-${index}`);
const panel = (page: Page, index: number) => page.locator(`#compare-panel-${index}`);
const video = (page: Page, index: number) => panel(page, index).locator('video');
const playButton = (page: Page, index: number) => panel(page, index).locator('.pf-clip-play');

/** The source a video has been given, or `null` while it has none. */
const sourceOf = (page: Page, index: number) => video(page, index).evaluate((element: HTMLVideoElement) => element.getAttribute('src'));

const isPaused = (page: Page, index: number) => video(page, index).evaluate((element: HTMLVideoElement) => element.paused);

/**
 * `play` and `paused` as a browser that could decode H.264 would have them,
 * for this page from its first script: `play` resolves and the video is
 * playing until `pause`. The real `play` is still called, and whatever it
 * answers ignored, so the file is fetched as it would be.
 */
async function pretendVideosPlay(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const playing = new WeakSet<HTMLMediaElement>();
    const { play, pause } = HTMLMediaElement.prototype;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      playing.add(this);
      play.call(this).catch(() => {});
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function (this: HTMLMediaElement) {
      playing.delete(this);
      pause.call(this);
    };
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      configurable: true,
      get(this: HTMLMediaElement) {
        return !playing.has(this);
      },
    });
  });
}

/** Every video file the page asks for, from the moment this is called. */
function videoRequests(page: Page): string[] {
  const asked: string[] = [];
  page.on('request', (request: Request) => {
    const { pathname } = new URL(request.url());
    if (pathname.endsWith('.mp4') || pathname.startsWith('/api/profile-files/file/')) asked.push(pathname);
  });
  return asked;
}

/** The profile in preview, at a desktop's size, with the section's tabs ready to be used. */
async function openProfile(page: Page, cms: { preview(path: string): Promise<void> }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 800 });
  await cms.preview('/profile');
  await expect(tab(page, 0)).toHaveAttribute('aria-selected', 'true');
}

/** Uploads `file` to the Company profile's files, and returns what the CMS made of it. */
async function uploadProfileFile(page: Page, file: { name: string; mimeType: string; buffer: Buffer }) {
  return page.request.post('/api/profile-files', {
    multipart: { file: { ...file, name: `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}` }, _payload: '{}' },
  });
}

test('every panel is in the first response, the first tab chosen, and no video with a source', async ({ page, cms }) => {
  await openProfile(page, cms);
  // Fetched by the browser, under the preview's cookie: the page as the server sends it, before any script.
  const html = await page.evaluate(async () => (await fetch('/profile')).text());

  for (const comparison of COMPARISONS) {
    expect(html).toContain(comparison.module);
    expect(html).toContain(comparison.question);
    // Waiting to be set, not set.
    expect(html).toContain(`data-src="${comparison.video}"`);
  }
  expect(html).toContain('الورقة من طلب اعتماد حقيقي. ورقة ربائد رسم توضيحي.');
  expect(html).toContain('في نفس اليوم، الساعة 17:53');
  expect(html).not.toMatch(/<video[^>]* src=/);
  expect(html.match(/<video[^>]*preload="none"/g)).toHaveLength(5);

  await expect(section(page)).toHaveClass(/\blight\b/);
  await expect(section(page).locator('h2')).toHaveText('خمسة أسئلة يومية. إجابتان.');
  await expect(panel(page, 0)).toBeVisible();
  for (const index of [1, 2, 3, 4]) await expect(panel(page, index)).toBeHidden();
  // The table's two columns, and a row of it.
  await expect(panel(page, 0).locator('thead th')).toHaveText(['قبل', 'بعد ربائد']);
  await expect(panel(page, 0).locator('tbody tr').first()).toContainText('6 بنود مرقّمة في رد الاستشاري');
});

test('a video starts only once it is on screen, and pauses off screen and when its tab is left', async ({ page, cms }) => {
  await pretendVideosPlay(page);
  const asked = videoRequests(page);
  await openProfile(page, cms);
  await page.waitForLoadState('load');

  // Loaded, and nothing fetched: the section is below the first screen.
  expect(await video(page, 0).evaluate((element) => element.getBoundingClientRect().top > window.innerHeight)).toBe(true);
  expect(asked).toEqual([]);
  expect(await sourceOf(page, 0)).toBeNull();

  await video(page, 0).scrollIntoViewIfNeeded();
  await expect.poll(() => sourceOf(page, 0)).toBe(COMPARISONS[0].video);
  await expect.poll(() => isPaused(page, 0)).toBe(false);
  await expect.poll(() => asked).toContain(COMPARISONS[0].video);
  // Muted, looping, and with the controls that stop it.
  expect(await video(page, 0).evaluate((element: HTMLVideoElement) => [element.muted, element.loop, element.controls])).toEqual([true, true, true]);
  // The other four are still nothing but their posters.
  for (const index of [1, 2, 3, 4]) expect(await sourceOf(page, index)).toBeNull();
  expect(asked.filter((each) => each !== COMPARISONS[0].video)).toEqual([]);

  // Another tab: the first stops, the second starts.
  await tab(page, 1).click();
  await expect(panel(page, 1)).toBeVisible();
  await expect.poll(() => isPaused(page, 0)).toBe(true);
  await expect.poll(() => sourceOf(page, 1)).toBe(COMPARISONS[1].video);
  await expect.poll(() => isPaused(page, 1)).toBe(false);

  // In Arabic the next tab is to the left.
  await tab(page, 1).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(tab(page, 2)).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => isPaused(page, 1)).toBe(true);
  await expect.poll(() => isPaused(page, 2)).toBe(false);

  // Scrolled away, it pauses.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => isPaused(page, 2)).toBe(true);
});

/** That a video on screen waits behind its poster and button, fetching nothing, then starts when pressed. */
async function waitsForItsButton(page: Page, asked: string[]): Promise<void> {
  await video(page, 0).scrollIntoViewIfNeeded();
  await expect(playButton(page, 0)).toHaveText(PLAY);
  await expect(playButton(page, 0)).toBeVisible();
  await expect(panel(page, 0).locator('.pf-clip-poster')).toBeVisible();
  // Nothing to wait for: a second on screen is longer than a video takes to be told it is.
  await page.waitForTimeout(1000);
  expect(await sourceOf(page, 0)).toBeNull();
  expect(await isPaused(page, 0)).toBe(true);
  expect(asked).toEqual([]);

  await playButton(page, 0).click();
  await expect.poll(() => sourceOf(page, 0)).toBe(COMPARISONS[0].video);
  await expect.poll(() => isPaused(page, 0)).toBe(false);
  await expect(playButton(page, 0)).toBeHidden();
}

test.describe('with reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('a video stays still behind its poster until its button is pressed', async ({ page, cms }) => {
    await pretendVideosPlay(page);
    const asked = videoRequests(page);
    await openProfile(page, cms);
    await waitsForItsButton(page, asked);
  });
});

for (const [name, connection] of [
  ['with Save-Data', { saveData: true, effectiveType: '4g' }],
  ['on a 2G connection', { saveData: false, effectiveType: '2g' }],
] as const) {
  test(`${name}, a video waits for its button too`, async ({ page, cms }) => {
    await pretendVideosPlay(page);
    // What Chromium tells a page about the connection it is on.
    await page.addInitScript((value) => Object.defineProperty(navigator, 'connection', { configurable: true, value }), connection);
    const asked = videoRequests(page);
    await openProfile(page, cms);
    await waitsForItsButton(page, asked);
  });
}

test('every word in the section is an Editor’s', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  const { compare } = saved;

  await profile.draft({
    ...saved,
    compare: {
      ...compare,
      title: { ...compare.title, ar: 'خمسة مواقف' },
      afterLabel: { ...compare.afterLabel, ar: 'مع ربائد' },
      playLabel: { ...compare.playLabel, ar: 'شغّل' },
      correspondence: {
        ...compare.correspondence,
        module: { ...compare.correspondence.module, ar: 'الخطابات' },
        question: { ...compare.correspondence.question, ar: 'أين الخطابات؟' },
        thirdRow: { ...compare.correspondence.thirdRow, after: { ...compare.correspondence.thirdRow.after, ar: 'فلتر الردود' } },
        note: { ...compare.correspondence.note, ar: 'ملاحظة جديدة.' },
      },
    },
  });
  await openProfile(page, cms);

  await expect(section(page).locator('h2')).toHaveText('خمسة مواقف');
  await expect(tab(page, 2)).toContainText('الخطابات');
  await tab(page, 2).click();
  await expect(panel(page, 2).locator('h3')).toHaveText('أين الخطابات؟');
  await expect(panel(page, 2).locator('thead th.pf-cmp-with')).toHaveText('مع ربائد');
  await expect(panel(page, 2).locator('tbody tr').nth(2).locator('td.pf-cmp-with')).toHaveText('فلتر الردود');
  await expect(panel(page, 2).locator('figcaption')).toHaveText('ملاحظة جديدة.');
  await expect(playButton(page, 2)).toHaveText('شغّل');
});

test('a video and a poster an Editor uploads are the ones served', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  // Ahmed's Daily report clip, uploaded as a new Approvals one: an MP4 under the limit.
  const buffer = await readFile(path.join(clips, '05-daily-report.mp4'));
  const uploaded = await uploadProfileFile(page, { name: 'approvals-again.mp4', mimeType: 'video/mp4', buffer });
  expect(uploaded.ok(), await uploaded.text()).toBe(true);
  const replacement = (await uploaded.json()).doc as { id: number; url: string; filename: string };
  const poster = await page.request.post('/api/media', {
    multipart: { file: await pictureFile({ width: 1600, height: 900 }), _payload: JSON.stringify({ alt: 'صورة المقارنة' }) },
  });
  expect(poster.ok(), await poster.text()).toBe(true);
  const picture = (await poster.json()).doc as { id: number; url: string };

  try {
    // Kept as it was uploaded, under a name of its own in the bucket.
    // Kept under the name it was uploaded with.
    expect(replacement.filename).toMatch(/^\d+-[a-z0-9]+-approvals-again\.mp4$/);

    // A new video is not published without its own poster: Ahmed's would stand in for it.
    const alone = await profile.attempt(
      { ...saved, compare: { ...saved.compare, approvals: { ...saved.compare.approvals, video: replacement.id, poster: null } } },
      'published',
    );
    expect(alone.status()).toBe(400);
    expect(await alone.text()).toContain('ارفع صورة الفيديو الجديد معه');

    await profile.draft({
      ...saved,
      compare: { ...saved.compare, approvals: { ...saved.compare.approvals, video: replacement.id, poster: picture.id } },
    });
    await pretendVideosPlay(page);
    const asked = videoRequests(page);
    await openProfile(page, cms);

    await expect(panel(page, 0).locator('.pf-clip-poster')).toHaveAttribute('src', picture.url);
    // The frame takes the poster's shape.
    await expect(panel(page, 0).locator('[data-clip]')).toHaveAttribute('style', /aspect-ratio:\s*1600\s*\/\s*900/);
    await video(page, 0).scrollIntoViewIfNeeded();
    await expect.poll(() => sourceOf(page, 0)).toBe(replacement.url);
    await expect.poll(() => asked).toContain(new URL(replacement.url, 'http://x').pathname);

    const served = await page.request.get(replacement.url);
    expect(served.status()).toBe(200);
    expect(served.headers()['content-type']).toBe('video/mp4');
    expect((await served.body()).equals(buffer)).toBe(true);
    // A browser asks for a video a part at a time.
    const part = await page.request.get(replacement.url, { headers: { Range: 'bytes=0-99' } });
    expect(part.status()).toBe(206);
    expect((await part.body()).length).toBe(100);
  } finally {
    // The draft put back before the files it points at go.
    await profile.restore();
    await page.request.delete(`/api/profile-files/${replacement.id}`);
    await page.request.delete(`/api/media/${picture.id}`);
  }
});

test('the CMS keeps nothing but an MP4 or a PDF, and nothing larger than the site can take', async ({ page, cms }) => {
  await cms.entry('profile-page').published();

  const picture = await uploadProfileFile(page, await pictureFile());
  expect(picture.status()).toBe(400);

  // Ahmed's Documents clip, 5.4 MB: more than a request to Vercel carries, and
  // kept, since a file goes from the browser straight to the bucket.
  const documents = await readFile(path.join(clips, '02-documents.mp4'));
  const kept = await uploadProfileFile(page, { name: 'documents.mp4', mimeType: 'video/mp4', buffer: documents });
  expect(kept.ok(), await kept.text()).toBe(true);
  await page.request.delete(`/api/profile-files/${(await kept.json()).doc.id}`);

  // The same clip made 9 MB: more than a visitor should download.
  const large = await uploadProfileFile(page, {
    name: 'documents-large.mp4',
    mimeType: 'video/mp4',
    buffer: Buffer.concat([documents, Buffer.alloc(9 * 1024 * 1024 - documents.length)]),
  });
  expect(large.status()).toBe(400);
  expect(await large.text()).toContain('8 ميغابايت');
});

test('the section cannot be hidden: the Profile PDFs link to it', async ({ page, cms }) => {
  const profile = cms.entry('profile-page');
  const saved = await profile.published();
  expect(Object.keys(saved.compare)).not.toContain('shows');

  // A switch sent anyway changes nothing.
  await profile.draft({ ...saved, compare: { ...saved.compare, shows: false } } as Profile);
  await openProfile(page, cms);
  await expect(section(page)).toBeVisible();
});

for (const phone of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`at ${phone.width}px, nothing in the section reaches past the screen, and its tabs scroll in their own row`, async ({
    page,
    cms,
  }) => {
    await page.setViewportSize(phone);
    await cms.preview('/profile');
    for (const index of [0, 4]) {
      await tab(page, index).click();
      await panel(page, index).scrollIntoViewIfNeeded();
      // What sticks out, though the page clips it: the section's own.
      expect((await whatOverflows(page)).filter((culprit) => culprit.startsWith('#compare '))).toEqual([]);
      expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(0);
    }
    // The fifth tab, chosen, is scrolled into its row rather than off the screen.
    const inItsRow = async () => {
      const row = (await page.locator('.pf-cmp-tabs').boundingBox())!;
      const last = (await tab(page, 4).boundingBox())!;
      return last.x >= row.x - 1 && last.x + last.width <= row.x + row.width + 1;
    };
    await expect.poll(inItsRow).toBe(true);
  });
}

test('no Content-Security-Policy keeps the videos out', async ({ page, cms }) => {
  await openProfile(page, cms);
  // As the browser is answered, under the preview's cookie.
  const [status, policy] = await page.evaluate(async () => {
    const response = await fetch('/profile');
    return [response.status, response.headers.get('content-security-policy')] as const;
  });
  expect(status).toBe(200);
  // The site sends none on its pages today; one added later has to let the
  // videos in, from the site itself, where both Ahmed's and an Editor's are.
  if (policy) {
    const media = /(?:^|;)\s*media-src([^;]*)/.exec(policy)?.[1] ?? /(?:^|;)\s*default-src([^;]*)/.exec(policy)?.[1];
    expect(media, policy).toMatch(/'self'/);
  }
});
