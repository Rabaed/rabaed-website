import { DEFAULT_LOCALE, LOCALES } from '@/lib/locales';
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
 */
export default function NotFound() {
  return (
    <main className="phero" lang={DEFAULT_LOCALE} dir={LOCALES[DEFAULT_LOCALE].dir}>
      <div className="wrap">
        <h1>الصفحة غير موجودة</h1>
        <p className="lead">
          الرابط الذي طلبته غير متاح. <a href="/">العودة إلى الصفحة الرئيسية</a>
        </p>
      </div>
    </main>
  );
}
