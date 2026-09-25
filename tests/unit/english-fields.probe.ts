/**
 * What the CMS says of each English word proposed for the English pages
 * (ticket 42), asked of the field that will hold it — its length, its marks,
 * the opening answer's 30 to 60 words — exactly as it will be asked when the
 * founder presses Publish with English among the page's languages. It prints
 * every word refused, with its place and the reason, as JSON on its last line.
 *
 * Run in a process of its own by `english-words.spec.ts`, never by Playwright,
 * for the reason `cms-boot.probe.ts` is: the CMS's configuration reaches
 * `next/cache`, which only a Payload process loads. Run it by hand while
 * writing the English:
 *
 *   node node_modules/payload/bin.js run tests/unit/english-fields.probe.ts
 */
import type { GlobalConfig, PayloadRequest } from 'payload';
import { ClosingSection } from '../../src/cms/globals/closing-section';
import { HomePage } from '../../src/cms/globals/home-page';
import { PartnershipPage } from '../../src/cms/globals/partnership-page';
import { ProductPage } from '../../src/cms/globals/product-page';
import { ReferralPage } from '../../src/cms/globals/referral-page';
import { StartPage } from '../../src/cms/globals/start-page';
import { ToolPage } from '../../src/cms/globals/tool-page';
import { TrustStripLogos } from '../../src/cms/globals/trust-strip';
import { ENGLISH_ENTRIES, ENGLISH_PAIRS } from '../../src/migrations/english-pages/entries';
import { MARKETING_PAGES, type MarketingPage } from '../../src/lib/page-registry';
import { englishFieldAt } from './cms-fields';

const ENTRIES: Readonly<Record<string, GlobalConfig>> = {
  'home-page': HomePage,
  'product-page': ProductPage,
  'start-page': StartPage,
  'tool-page': ToolPage,
  'referral-page': ReferralPage,
  'partnership-page': PartnershipPage,
  'closing-section': ClosingSection,
  'trust-strip': TrustStripLogos,
};


/**
 * The entry that holds a proposed word, and where in it. A word proposed for
 * the entry that held every page's search settings is held now on the page's
 * own entry, in its search tab (ticket 91): the proposal's path begins with
 * the page, `product.title`.
 */
function heldAt(pair: (typeof ENGLISH_PAIRS)[number]): { entry: GlobalConfig; path: readonly (string | number)[] } {
  if (pair.entry !== 'search-settings') return { entry: ENTRIES[pair.entry], path: pair.path };
  const [page, ...rest] = pair.path;
  return { entry: ENTRIES[MARKETING_PAGES[page as MarketingPage].entry.slug], path: ['search', ...rest] };
}

/**
 * Enough of a request for Payload's own validators: they read the default
 * length from the configuration and word a refusal with `t`, which here says
 * which rule and with what.
 */
const REQUEST = {
  payload: { config: {} },
  t: (key: string, values?: Record<string, unknown>) =>
    `${key} ${JSON.stringify({ ...values, stringValue: undefined })}`,
  i18n: { language: 'en' },
} as unknown as PayloadRequest;

function at(value: unknown, path: readonly (string | number)[]): unknown {
  return path.reduce<unknown>((inside, step) => (inside as Record<string | number, unknown> | undefined)?.[step], value);
}

/** Every English word the CMS would refuse, with its place and its reason. */
async function refusedEnglish(): Promise<string[]> {
  const refused: string[] = [];
  for (const pair of ENGLISH_PAIRS) {
    const { entry, path } = heldAt(pair);
    const twins = ENGLISH_ENTRIES.find((each) => each.slug === pair.entry)!.twins;
    const blockTypeAt = (path: readonly (string | number)[]) =>
      twins
        .map(([arabic]) => at(arabic, [...path, 'blockType']))
        .find((type): type is string => typeof type === 'string');
    const field = englishFieldAt(entry, path, blockTypeAt);
    const validate = (field as { validate?: (value: unknown, options: unknown) => Promise<string | true> }).validate;
    const answer = validate
      ? await validate(pair.en, {
          ...field,
          req: REQUEST,
          data: { languages: ['ar', 'en'] },
          siblingData: { ar: pair.ar, en: pair.en },
        })
      : true;
    if (answer !== true) refused.push(`${pair.entry} ${pair.path.join('.')} (${pair.en.length}): ${answer} — «${pair.en}»`);
  }
  return refused;
}

console.log(JSON.stringify(await refusedEnglish()));
