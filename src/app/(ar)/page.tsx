import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'ar',
  title: 'ربائد · ثلاثة أطراف. سجل واحد.',
  description:
    'منصة سعودية تجمع المالك والاستشاري والمقاول على سجل واحد موثّق ومؤرخ لكل طلب واعتماد.',
});

/**
 * The Arabic home page, as a skeleton: the Reference site's own hero copy,
 * server-rendered, in the self-hosted typeface. Ticket 04 gives it the page
 * shell and ticket 06 the real hero.
 *
 * The copy is verbatim from `reference/site/index.html` so that what is being
 * proved here is the delivery path for real content, not for placeholder text.
 */
export default function HomePage() {
  return (
    <main className="skeleton">
      <p className="skeleton-eyebrow">نظام تشغيل مشاريع الإنشاء · ربائد</p>
      <h1>
        ثلاثة أطراف.
        <br />
        سجل واحد.
        <br />
        مسؤولية واضحة.
      </h1>
      <p className="skeleton-lead">
        ربائد تجمع المالك والاستشاري والمقاول على منصة واحدة: مراسلات معتمدة، اعتمادات وطلبات
        فحص، مستندات بأحدث إصدار، وتقارير يومية من الميدان — وكل خطوة موثّقة ومؤرخة باسم من قام
        بها.
      </p>
    </main>
  );
}
