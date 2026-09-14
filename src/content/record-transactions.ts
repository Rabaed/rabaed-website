/**
 * The five transaction types in the home page's Record section, each shown by
 * the trail one transaction of that type leaves in the Record — who raised it,
 * its receipt, who checked it, and how it was decided.
 *
 * Verbatim from `reference/site/index.html`. The chip labels are the section's
 * markup; the trails are its script's `REC` list, which is what a visitor
 * actually reads. The markup's own first trail differs from `REC`'s in its last
 * step, and the script overwrites it before the section is in view, so `REC` is
 * the copy.
 *
 * Ticket 21 moves page copy into the CMS.
 */
import type { TransactionStep, TransactionType } from '@/components/home/record';

const received = (time: string): TransactionStep => ({ action: 'استُلم', by: 'إشعار استلام تلقائي', time });

export const TRANSACTION_TYPES: readonly TransactionType[] = [
  {
    label: 'خطاب رسمي',
    title: 'LTR-088 · خطاب — طلب تمديد مدة',
    steps: [
      { action: 'أُرسل', by: 'م. فهد — المقاول', time: '08:15' },
      received('08:15'),
      { action: 'دُقق', by: 'م. سارة — الاستشاري', time: '13:40' },
      { action: 'رُدَّ عليه', by: '“يُمنح 14 يوماً” — المالك', time: '11:05' },
    ],
  },
  {
    label: 'اعتماد مادة (MIR)',
    title: 'SUB-031 · اعتماد مادة — بلاط الواجهات',
    steps: [
      { action: 'أُرسل', by: 'م. فهد — المقاول', time: '08:15' },
      received('08:15'),
      { action: 'دُقق', by: 'م. سارة — الاستشاري', time: '13:40' },
      { action: 'اعتُمد بملاحظات', by: '“عينة لون إضافية” — م. خالد', time: '10:02' },
    ],
  },
  {
    label: 'طلب تسليم أعمال (WIR)',
    title: 'WIR-0142 · طلب تسليم أعمال — حديد سقف الدور 3',
    steps: [
      { action: 'أُرسل', by: 'م. فهد — المقاول', time: '07:50' },
      received('07:50'),
      { action: 'فُحص في الموقع', by: 'م. سارة · 4 صور', time: '11:20' },
      { action: 'اعتُمد', by: '“مطابق — يُسمح بالصب”', time: '12:05' },
    ],
  },
  {
    label: 'تحديث جدول زمني',
    title: 'SCH-04 · تحديث الجدول الزمني — أغسطس',
    steps: [
      { action: 'رُفع التحديث', by: 'مخطط المقاول', time: '09:10' },
      { action: 'استُلم', by: 'الاستشاري والمالك', time: '09:10' },
      { action: 'رُوجع الأثر', by: 'تأخر 6 أيام على التسليم', time: '14:25' },
      { action: 'اعتُمد التحديث', by: 'بملاحظة على المسار الحرج', time: '16:40' },
    ],
  },
  {
    label: 'مستخلص مالي (IPC)',
    title: 'IPC-06 · مستخلص مالي — الدفعة السادسة',
    steps: [
      { action: 'قُدِّم', by: 'المقاول — بالكميات المنفذة', time: '08:00' },
      received('08:00'),
      { action: 'دُقق', by: 'مطابقة مع الطلبات المعتمدة', time: '12:30' },
      { action: 'اعتُمد للصرف', by: 'بعد خصم بند غير مطابق', time: '09:15' },
    ],
  },
];
