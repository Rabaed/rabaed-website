import { Card, TeaserHead } from '@/components/tool/parts';

/**
 * «المتطلبات»: what the tool needs to run. The cards' labels are Arabic words
 * rather than numbers, so they keep the Arabic face (`tool.css`).
 *
 * All copy is verbatim from `reference/site/tool.html`.
 */
export function Requirements() {
  return (
    <section id="req" className="light pad" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="wrap">
        <TeaserHead eyebrow="المتطلبات" title="ما الذي تحتاجه لتشغيلها" />
        <div className="rt-row">
          <Card label="النظام" title="سطح المكتب" text="ويندوز أو ماك أو لينكس." />
          <Card label="التجربة الكاملة" title="Chrome أو Edge" text="مع حفظ المرفقات داخل مجلد المشروع." />
          <Card label="وضع مبسّط" title="Firefox و Safari" text="السجلات داخل المتصفح والمرفقات معطّلة." />
        </div>
      </div>
    </section>
  );
}
