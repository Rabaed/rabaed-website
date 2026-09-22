import { PageShell } from '@/components/page-shell';
import { Questions } from '@/components/questions';
import { breadcrumbData, faqData, StructuredData } from '@/components/structured-data';
import { Download } from '@/components/tool/download';
import { Features } from '@/components/tool/features';
import { ToolHero } from '@/components/tool/hero';
import { How } from '@/components/tool/how';
import { Privacy } from '@/components/tool/privacy';
import { Requirements } from '@/components/tool/requirements';
import { Upsell } from '@/components/tool/upsell';
import { Why } from '@/components/tool/why';
import type { ToolPageContent } from '@/content/pages/tool';
import type { Locale } from '@/lib/locales';

/**
 * The tool page — the landing page for the free Pour Tracker — in either
 * language, in the Reference site's order: the hero, why the tool exists, what
 * it does, the three steps, where its files live, what it needs, the download
 * form, the questions, and the upsell to Rabaed.
 *
 * It describes and delivers the tool (CONTEXT.md). The file itself is ticket
 * 18's, and is the same file in both languages: it carries a language switch
 * of its own.
 *
 * Its words come from its entry in the CMS, through `src/content/pages/tool.ts`
 * (ticket 54), in the language asked for (ticket 42).
 */
export async function ToolPage({
  locale,
  locales,
  content,
}: {
  locale: Locale;
  /** The languages the page is published in, for the switcher. */
  locales: readonly Locale[];
  content: ToolPageContent;
}) {
  return (
    <PageShell locale={locale} path="/tool" locales={locales}>
      <ToolHero content={content.hero} />
      {content.why.shows && <Why content={content.why} />}
      {content.features.shows && <Features content={content.features} />}
      <How content={content.how} />
      {content.privacy.shows && <Privacy content={content.privacy} />}
      {content.requirements.shows && <Requirements content={content.requirements} />}
      <Download content={content.download} form={content.downloadForm} />
      {content.questions.shows && <Questions content={content.questions} />}
      {content.upsell.shows && <Upsell content={content.upsell} />}
      <StructuredData data={await breadcrumbData(locale, [{ name: content.meta.name, path: '/tool' }])} />
      <StructuredData data={faqData(content.questions)} />
    </PageShell>
  );
}
