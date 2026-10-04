/**
 * The frame every email the site sends is drawn in: a card 600 pixels wide on
 * the site's own background, built from tables with every style inline,
 * because that is what Outlook — where the team reads its alerts, and where
 * many applicants read their confirmations — draws faithfully. A block of
 * text styled to keep its line breaks arrived there as one long line.
 */
import { LOCALES, type Locale } from '../lib/locales';

/** The site's own colours (`src/styles/tokens.css`), written out: a mail client reads no stylesheet. */
export const COLOUR = {
  accent: '#F95738',
  ink: '#222222',
  muted: '#6B6A66',
  line: '#E3E1DC',
  soft: '#F3F2EF',
  paper: '#FAFAF8',
  dark: '#14161C',
} as const;

export const FONT = 'Tahoma,Arial,sans-serif';

/** The card's width, and inside its one-pixel border. */
export const CARD_WIDTH = 600;
export const CARD_INNER_WIDTH = CARD_WIDTH - 2;
/** The width of the text column, inside the card's 24-pixel margins. */
export const COLUMN_WIDTH = CARD_WIDTH - 2 * 24;

export function escaped(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Which way a language runs, and the side its text starts from. */
export function direction(locale: Locale): { dir: 'rtl' | 'ltr'; start: 'right' | 'left' } {
  const dir = LOCALES[locale].dir;
  return { dir, start: dir === 'rtl' ? 'right' : 'left' };
}

/** A web, mail or phone address, or `null` for anything a mail client should not be asked to follow. */
export function followable(address: string): string | null {
  const trimmed = address.trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(trimmed) ? trimmed : null;
}

/** A button: a link drawn on a coloured cell, which Outlook keeps where it drops a link's own padding. */
export function button(label: string, href: string): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLOUR.accent};border-radius:6px">` +
    `<a href="${escaped(href)}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none">${escaped(label)}</a>` +
    `</td></tr></table>`
  );
}

/** The dark band an email opens with when it has no picture: a small line above a heading. */
export function headerBand(kicker: string | null, heading: string, start: 'right' | 'left'): string {
  return (
    `<tr><td style="padding:20px 24px;background:${COLOUR.dark};border-top:4px solid ${COLOUR.accent};text-align:${start}">` +
    (kicker ? `<div style="font-family:${FONT};font-size:13px;color:#BDBBB5">${escaped(kicker)}</div>` : '') +
    `<div style="padding-top:4px;font-family:${FONT};font-size:20px;font-weight:bold;color:#FFFFFF">${escaped(heading)}</div></td></tr>`
  );
}

/** The quiet band an email closes with. `content` is HTML. */
export function footerBand(content: string, start: 'right' | 'left'): string {
  return `<tr><td style="padding:16px 24px;background:${COLOUR.paper};border-top:1px solid ${COLOUR.line};font-family:${FONT};font-size:13px;color:${COLOUR.muted};text-align:${start}">${content}</td></tr>`;
}

/** A whole email: `rows` are the card's `<tr>`s, in order. */
export function emailDocument(locale: Locale, title: string, rows: string): string {
  const { dir } = direction(locale);
  return (
    `<!doctype html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escaped(title)}</title></head>` +
    `<body style="margin:0;padding:0;background:${COLOUR.soft}">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOUR.soft}"><tr><td align="center" style="padding:24px 12px">` +
    `<table role="presentation" width="${CARD_WIDTH}" cellpadding="0" cellspacing="0" border="0" dir="${dir}" style="width:100%;max-width:${CARD_WIDTH}px;background:#FFFFFF;border:1px solid ${COLOUR.line};border-collapse:collapse">` +
    rows +
    `</table></td></tr></table></body></html>`
  );
}
