import type { ClosingSectionContent } from '@/components/closing-section';
import { localePath } from '@/lib/locales';

/**
 * «كيف نبدأ معك», the block the home and product pages both end on — one
 * text, so the two pages cannot drift apart.
 *
 * Verbatim from `reference/site/index.html`.
 */
export const CLOSING_SECTION: { readonly ar: ClosingSectionContent } = {
  ar: {
    eyebrow: 'كيف نبدأ معك',
    heading: 'فريقنا في موقعك. الأطراف الثلاثة على المنصة خلال أيام.',
    steps: [
      {
        label: '01 · إعداد',
        text: 'نُعدّ المشروع والنماذج، وندعو المالك والاستشاري والمقاول — و15 دقيقة مع كل فريق.',
      },
      { label: '02 · تشغيل', text: 'أقل من يوم، دون توقف للعمل. يبدأ الجميع من حيث وصل المشروع.' },
      { label: '03 · ضمان', text: '60 يوماً من التفعيل — أو نعيد كامل المبلغ، ونسلّمكم نسخة كاملة من السجل.' },
    ],
    more: { label: 'التفاصيل والأسئلة الشائعة ←', href: localePath('ar', '/start') },
  },
};
