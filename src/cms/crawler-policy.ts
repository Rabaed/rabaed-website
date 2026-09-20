/**
 * Whether AI training crawlers may read the site: the one switch in that
 * decision, as Ahmed last saved it (ticket 33; `src/cms/globals/ai-crawlers.ts`).
 */
import config from '@payload-config';
import { getPayload } from 'payload';

/**
 * Allowed unless the switch has been turned off. A database whose row has
 * never been written answers nothing, and the default is the permissive one,
 * as the field's own default is.
 *
 * That default covers an unwritten row and nothing else: a database that
 * cannot be reached throws, and the build fails on `robots.txt` as it already
 * fails on every page that reads the CMS. Deliberately — the alternative is a
 * transient error publishing a permission the founders may have refused, in a
 * file crawlers act on and nobody rereads.
 */
export async function trainingCrawlersAllowed(): Promise<boolean> {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'ai-crawlers', depth: 0 });
  return settings.allowTraining !== false;
}
