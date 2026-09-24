import { getNotFound } from '@/content/site-words';
import { DEFAULT_LOCALE, LOCALES, localePath } from '@/lib/locales';
import '@/styles/globals.css';

/**
 * A URL matching neither locale's route group is inside neither root layout,
 * so Next.js renders this in a bare default root layout of its own — an
 * `<html>` with no `lang` and no `dir`, which would lay Arabic text out left
 * to right.
 *
 * Two things were tried and rejected before settling for declaring the
 * language on the content instead:
 *
 *  - Rendering `<html>` here. It nests inside Next's default document and the
 *    browser discards it, so the page silently keeps the wrong direction.
 *  - A catch-all route inside the `(ar)` group calling `notFound()`, to put
 *    the 404 inside the Arabic layout. In Next 16 that answers with the
 *    framework's bare error document and no server-rendered content at all,
 *    which is worse than an unlabelled `<html>`.
 *
 * `lang` and `dir` on an element are valid HTML and are what a screen reader
 * and the bidirectional algorithm read for that subtree, so the page is
 * correct to a visitor. What is missing is the document-level `lang`, on a
 * page that is `noindex` and has no design of its own yet.
 *
 * Its words are in the CMS (ticket 59), in Arabic: the address that reached
 * here matched no route, so it names no language to answer in, and the site's
 * own language answers.
 */
/**
 * Rebuilt at most ten minutes after it was last built, whether or not a
 * publish reached it (ticket 84, ADR-0016). Publishing marks it with the rest
 * (`PAGE_LAYOUTS` in `src/cms/revalidation.ts`), but it sits beneath neither
 * language's layout, so their age never reached it: it was the one cached page
 * a lost mark left wrong until the next publish.
 *
 * Next builds this file as the page of a route of its own, `/_not-found`, and
 * reads the age from it as from any page. Written out rather than imported
 * because Next reads only a literal — see `src/lib/cache-age.ts`, which holds
 * the number, and `tests/unit/cached-page-age.spec.ts`, which holds this line
 * to it.
 */
export const revalidate = 600;

export default async function NotFound() {
  const { heading, lead, homeLabel } = await getNotFound(DEFAULT_LOCALE);

  return (
    <main className="phero" lang={DEFAULT_LOCALE} dir={LOCALES[DEFAULT_LOCALE].dir}>
      <div className="wrap">
        <h1>{heading}</h1>
        <p className="lead">
          {lead} <a href={localePath(DEFAULT_LOCALE, '/')}>{homeLabel}</a>
        </p>
      </div>
    </main>
  );
}
