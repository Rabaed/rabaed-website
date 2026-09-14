/**
 * Dates as the site writes them.
 */

/** A day of the Gregorian calendar, with its month counted from 1. */
export type CalendarDay = { day: number; month: number; year: number };

/** The Gregorian months in Arabic, as the approved legal documents write them. */
export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

/**
 * The calendar day a moment falls on in Riyadh, where the company is. The CMS
 * stores moments in UTC, and an article published shortly after midnight in
 * Riyadh is still the day before in UTC.
 */
export function riyadhDay(moment: string): CalendarDay {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(new Date(moment));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((piece) => piece.type === type)?.value);
  return { day: part('day'), month: part('month'), year: part('year') };
}
