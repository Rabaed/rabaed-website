import { draftMode } from 'next/headers';
import '@/styles/preview-banner.css';

/**
 * Tells an editor they are looking at saved drafts rather than the published
 * site, and lets them leave. Nobody else ever sees it: preview needs an
 * editor's login (`src/app/(payload)/api/preview/route.ts`).
 *
 * A plain form, not a link: see the exit route for why leaving is a POST.
 */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="preview-banner" role="status">
      <span>معاينة — تعرض هذه الصفحة المسودّات المحفوظة قبل نشرها.</span>
      <form method="post" action="/api/preview/exit">
        <button type="submit">إنهاء المعاينة</button>
      </form>
    </div>
  );
}
