import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { Download } from '@/components/tool/download';
import { Features } from '@/components/tool/features';
import { ToolHero } from '@/components/tool/hero';
import { How } from '@/components/tool/how';
import { Privacy } from '@/components/tool/privacy';
import { Requirements } from '@/components/tool/requirements';
import { Upsell } from '@/components/tool/upsell';
import { Why } from '@/components/tool/why';
import { getToolPage } from '@/content/pages/tool';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getToolPage('ar');
  return pageMetadata({ locale: 'ar', path: '/tool', ...meta });
}

/**
 * The Arabic tool page — the landing page for the free Pour Tracker — in the
 * Reference site's order: the hero, why the tool exists, what it does, the
 * three steps, where its files live, what it needs, the download form, the
 * questions, and the upsell to Rabaed.
 *
 * It describes and delivers the tool (CONTEXT.md). The file itself is ticket
 * 18's; the form that delivers it is ticket 30's to make work.
 *
 * Its words come from `src/content/pages/tool.ts`.
 */
export default async function ToolPage() {
  const content = await getToolPage('ar');

  return (
    <PageShell locale="ar" path="/tool">
      <ToolHero content={content.hero} />
      {content.why.shows && <Why content={content.why} />}
      {content.features.shows && <Features content={content.features} />}
      <How content={content.how} />
      {content.privacy.shows && <Privacy content={content.privacy} />}
      {content.requirements.shows && <Requirements content={content.requirements} />}
      <Download content={content.download} />
      {content.questions.shows && <Questions content={content.questions} />}
      {content.upsell.shows && <Upsell content={content.upsell} />}
    </PageShell>
  );
}
