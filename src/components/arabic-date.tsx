import { ARABIC_MONTHS, type CalendarDay } from '@/lib/dates';

/**
 * A date in Arabic — ١٣ سبتمبر ٢٠٢٦ written with Latin numerals, as the site
 * writes it. Only the numerals are `.mono`: DM Mono has no Arabic glyphs
 * (spec: Design system).
 */
export function ArabicDate({ date }: { date: CalendarDay }) {
  return (
    <>
      <span className="mono">{date.day}</span> {ARABIC_MONTHS[date.month - 1]} <span className="mono">{date.year}</span>
    </>
  );
}
