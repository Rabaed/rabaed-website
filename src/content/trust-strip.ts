/**
 * The Trust strip: the companies already working on Rabaed, in the order the
 * Reference site lists them (CONTEXT.md).
 *
 * Permission to show these marks is cleared by the founders, covered by the
 * existing contracts (spec: Further Notes). Ticket 20 moves this list into the
 * CMS so Ahmed can add a client the day one signs, with a link on each mark;
 * until then it is here, and adding one means a deploy.
 *
 * `height` is the drawn height each mark needs to look the same weight as its
 * neighbours — a wordmark set in small type has to stand taller than a compact
 * monogram to read at all. These are the Reference site's own per-logo
 * overrides, which it wrote as eight CSS rules keyed on `data-k`; carrying the
 * number with the logo instead means a new one arrives complete rather than
 * needing a stylesheet edit as well.
 *
 * `width` and `height` on the file are the intrinsic pixel sizes, so the
 * browser reserves the right box before the image arrives.
 *
 * One strip for every page that carries it — home, product and start — as the
 * spec's Trust strip global is one list.
 */
import type { TrustStripContent, TrustStripLogo } from '@/components/home/trust-strip';

const LOGOS: readonly TrustStripLogo[] = [
  { key: 'nawah', name: 'نواة للاستثمار العقاري', height: 32, intrinsic: { width: 339, height: 112 } },
  { key: 'staterra', name: 'Staterra', height: 26, intrinsic: { width: 499, height: 112 } },
  { key: 'alsharq', name: 'شركة الشرق للاستشارات الهندسية', height: 42, intrinsic: { width: 209, height: 112 } },
  { key: 'shaheen', name: 'شاهين للاستشارات الهندسية', height: 42, intrinsic: { width: 103, height: 112 } },
  { key: 'north-injazat', name: 'North Injazat', height: 42, intrinsic: { width: 171, height: 112 } },
  { key: 'amak', name: 'شركة أماك بيلد', height: 38, intrinsic: { width: 151, height: 112 } },
  { key: 'smart-directions', name: 'Smart Directions', height: 32, intrinsic: { width: 305, height: 112 } },
  { key: 'sika', name: 'Sika', height: 42, intrinsic: { width: 94, height: 112 } },
];

export const TRUST_STRIP: { readonly ar: TrustStripContent } = {
  ar: {
    caption: 'أطراف نشطة حالياً تستخدم ربائد',
    sectionName: 'جهات تعمل على ربائد',
    logos: LOGOS,
  },
};
