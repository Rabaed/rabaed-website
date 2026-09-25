import type { Locale } from '@/lib/locales';
import type { MarketingPage } from '@/lib/page-registry';
import { getHomePage } from './home';
import type { PageMeta } from './page-content';
import { getPartnershipPage } from './partnership';
import { getProductPage } from './product';
import { getReferralPage } from './referral';
import { getStartPage } from './start';
import { getToolPage } from './tool';

/**
 * The module that reads each marketing page, by its key in the page registry
 * (ticket 92, `src/lib/page-registry.ts`). Beside the registry rather than in
 * it, because the registry is read by the CMS configuration and the tests,
 * and a page's module reads the CMS. A page the registry lists and this does
 * not is a type error, and so is a key the registry does not have.
 */
export const PAGE_LOADERS: { readonly [Key in MarketingPage]: (locale: Locale) => Promise<{ readonly meta: PageMeta }> } = {
  home: getHomePage,
  product: getProductPage,
  start: getStartPage,
  tool: getToolPage,
  referral: getReferralPage,
  partnership: getPartnershipPage,
};
