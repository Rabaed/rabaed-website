import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { Download } from '@/components/tool/download';
import { Features } from '@/components/tool/features';
import { ToolHero } from '@/components/tool/hero';
import { How } from '@/components/tool/how';
import { Privacy } from '@/components/tool/privacy';
import { ToolQuestions } from '@/components/tool/questions';
import { Requirements } from '@/components/tool/requirements';
import { Upsell } from '@/components/tool/upsell';
import { Why } from '@/components/tool/why';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  path: '/tool',
  title: 'ربائد · متتبّع الصبّات واختبارات الكسر — أداة مجانية',
  description:
    'ملف HTML واحد يفتح بنقرتين. سجّل الصبّة واعرف موعد اختبار الكسر ٧ و ٢٨ يوماً قبل أن يتأخر. بدون حساب، بدون سيرفر، بياناتك تبقى على جهازك.',
});

/**
 * The Arabic tool page — the landing page for the free Pour Tracker — in the
 * Reference site's order: the hero, why the tool exists, what it does, the
 * three steps, where its files live, what it needs, the download form, the
 * questions, and the upsell to Rabaed.
 *
 * It describes and delivers the tool (CONTEXT.md). The file itself is ticket
 * 18's; the form that delivers it is ticket 30's to make work.
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export default function ToolPage() {
  return (
    <PageShell locale="ar" path="/tool">
      <ToolHero />
      <Why />
      <Features />
      <How />
      <Privacy />
      <Requirements />
      <Download />
      <ToolQuestions />
      <Upsell />
    </PageShell>
  );
}
