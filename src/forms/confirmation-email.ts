/**
 * The applicant's confirmation email: what Ahmed writes for each form in the
 * CMS as rich text, under the one banner every form shares, with a button if
 * he gives it one — as HTML in the site's email frame (`./email-frame.ts`),
 * and as plain text beside it.
 *
 * Drawn from the rich text's own nodes rather than by Payload's HTML
 * converter, because an email takes nothing but inline styles, an image only
 * at an address it can reach from anywhere, and a link only to somewhere a
 * mail client should follow.
 */
import type { Locale } from '../lib/locales';
import { NAME_PLACEHOLDER } from './definition';
import {
  button,
  CARD_INNER_WIDTH,
  COLOUR,
  COLUMN_WIDTH,
  direction,
  emailDocument,
  escaped,
  followable,
  FONT,
  footerBand,
  headerBand,
} from './email-frame';

/** A node of Lexical rich text, as Payload stores it: only what this file reads of one. */
type RichNode = {
  readonly type: string;
  readonly children?: readonly RichNode[];
  readonly text?: string;
  readonly format?: number | string;
  readonly tag?: string;
  readonly listType?: string;
  readonly fields?: { readonly url?: string | null } | null;
  readonly value?: unknown;
};

export type RichText = { readonly root: { readonly children: readonly RichNode[] } };

/** An image from the CMS's email images, as Payload hands it over: addresses on this site. */
export type EmailImage = {
  readonly url?: string | null;
  readonly alt?: string | null;
  readonly width?: number | null;
  readonly sizes?: { readonly email?: { readonly url?: string | null; readonly width?: number | null } | null } | null;
};

export type ConfirmationDesign = {
  readonly message: RichText;
  /** The banner every form's confirmation opens with, or `null` while none is chosen. */
  readonly banner: EmailImage | null;
  readonly button: { readonly label: string; readonly link: string } | null;
};

type Recipient = {
  readonly locale: Locale;
  /** What the applicant typed as their name. */
  readonly name: string;
  /** Where the site answers, which the email's images and its footer link point at. */
  readonly siteOrigin: string;
};

/** The company's name, as each language writes it: what heads an email with no banner. */
const COMPANY: Readonly<Record<Locale, string>> = { ar: 'ربائد', en: 'Rabaed' };

/** The longest name a confirmation greets its visitor by (ticket 81). */
const GREETING_NAME_MAX = 60;

/** Lexical's text formats, as the bits of a text node's `format`. */
const BOLD = 1;
const ITALIC = 2;
const UNDERLINE = 8;

export function confirmationMail(design: ConfirmationDesign, recipient: Recipient): { text: string; html: string } {
  const { locale, siteOrigin } = recipient;
  const { start } = direction(locale);
  const words = (text: string) => greeted(text, NAME_PLACEHOLDER[locale], recipient.name);
  const href = design.button ? followable(design.button.link) : null;
  const theButton = design.button && href && design.button.label.trim() ? { label: design.button.label.trim(), href } : null;

  const blocks = design.message.root.children.map((node) => blockText(node, words)).filter((block) => block !== null);
  const text = [...blocks, ...(theButton ? [`${theButton.label}: ${theButton.href}`] : [])].join('\n\n');

  const banner = design.banner ? image(design.banner, siteOrigin, CARD_INNER_WIDTH) : null;
  const body = design.message.root.children.map((node) => blockHtml(node, { words, start, siteOrigin })).join('');
  const home = `${siteOrigin}${locale === 'ar' ? '' : `/${locale}`}`;

  const html = emailDocument(
    locale,
    COMPANY[locale],
    (banner ? `<tr><td style="padding:0;line-height:0;font-size:0">${banner}</td></tr>` : headerBand(null, COMPANY[locale], start)) +
      `<tr><td style="padding:28px 24px 8px;text-align:${start}">${body}</td></tr>` +
      (theButton ? `<tr><td style="padding:0 24px 28px;text-align:${start}">${button(theButton.label, theButton.href)}</td></tr>` : '') +
      footerBand(
        `${escaped(COMPANY[locale])} · <a href="${escaped(home)}" style="color:${COLOUR.muted};text-decoration:underline">${escaped(home.replace(/^https?:\/\//, ''))}</a>`,
        start,
      ),
  );

  return { text, html };
}

/**
 * Plain text as the rich text Ahmed edits: a paragraph for each run of text
 * between blank lines, a line break for each line inside one. The opposite of
 * what the plain text of an email is made from (`blockText`), so a form's
 * text written before the confirmation was rich comes back out as it went in.
 */
export function richTextFromPlainText(text: string): RichText {
  const paragraphs = text.replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '').split(/\n{2,}/);
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        textFormat: 0,
        textStyle: '',
        children: paragraph.split('\n').flatMap((line, index) => [
          ...(index > 0 ? [{ type: 'linebreak', version: 1 }] : []),
          ...(line ? [{ type: 'text', text: line, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] : []),
        ]),
      })),
    },
  } as RichText;
}

/**
 * A confirmation's words with the visitor's name in the placeholder's place —
 * when what they typed reads as a name (ticket 81, ADR-0022). The name field
 * takes anything two letters long, so a "name" can be an advert with a link in
 * it, and the greeting would be Rabaed's mailbox sending it. So a name longer
 * than `GREETING_NAME_MAX`, or with a digit in any script, an «@», a link or a
 * web address in it, is left out with the space before it: «مرحباً،»,
 * "Hello,". An engineer's «م.» before a name is not a web address.
 */
function greeted(body: string, placeholder: string, name: string): string {
  const aName = name.length <= GREETING_NAME_MAX && !/[\p{Nd}@<>]|:\/\/|www\.|[\p{L}\p{N}-]\.[a-z]{2,}/iu.test(name);
  if (aName) return body.replaceAll(placeholder, name);
  const pattern = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return body.replace(new RegExp(`[^\\S\\n]*${pattern}`, 'g'), '');
}

/** A block's plain text, or `null` for one that has none: an image. */
function blockText(node: RichNode, words: (text: string) => string): string | null {
  if (node.type === 'upload') return null;
  if (node.type === 'list') {
    return (node.children ?? [])
      .map((item, index) => `${node.listType === 'number' ? `${index + 1}.` : '•'} ${inlineText(item.children ?? [], words)}`)
      .join('\n');
  }
  return inlineText(node.children ?? [], words);
}

function inlineText(nodes: readonly RichNode[], words: (text: string) => string): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return words(node.text ?? '');
      if (node.type === 'linebreak') return '\n';
      const inside = inlineText(node.children ?? [], words);
      if (node.type === 'link' || node.type === 'autolink') {
        const href = followable(node.fields?.url ?? '');
        return href && href !== inside ? `${inside} (${href})` : inside;
      }
      return inside;
    })
    .join('');
}

type Drawing = { readonly words: (text: string) => string; readonly start: 'right' | 'left'; readonly siteOrigin: string };

const PARAGRAPH = `margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.8;color:${COLOUR.ink}`;

function blockHtml(node: RichNode, drawing: Drawing): string {
  const { start, siteOrigin } = drawing;
  const inside = () => inlineHtml(node.children ?? [], drawing);
  switch (node.type) {
    case 'heading': {
      const tag = node.tag === 'h3' ? 'h3' : 'h2';
      const size = tag === 'h3' ? 18 : 22;
      return `<${tag} style="margin:8px 0 12px;font-family:${FONT};font-size:${size}px;line-height:1.5;font-weight:bold;color:${COLOUR.ink};text-align:${start}">${inside()}</${tag}>`;
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      const items = (node.children ?? [])
        .map((item) => `<li style="margin:0 0 6px">${inlineHtml(item.children ?? [], drawing)}</li>`)
        .join('');
      return `<${tag} style="margin:0 0 16px;padding-${start}:24px;font-family:${FONT};font-size:16px;line-height:1.8;color:${COLOUR.ink};text-align:${start}">${items}</${tag}>`;
    }
    case 'upload': {
      const shown = typeof node.value === 'object' && node.value ? image(node.value as EmailImage, siteOrigin, COLUMN_WIDTH) : null;
      return shown ? `<div style="margin:0 0 16px">${shown}</div>` : '';
    }
    case 'quote':
      return `<blockquote style="margin:0 0 16px;padding-${start}:16px;border-${start}:3px solid ${COLOUR.accent};${PARAGRAPH}">${inside()}</blockquote>`;
    default: {
      const content = inside();
      return `<p style="${PARAGRAPH};text-align:${start}">${content || '&nbsp;'}</p>`;
    }
  }
}

function inlineHtml(nodes: readonly RichNode[], drawing: Drawing): string {
  return nodes
    .map((node) => {
      if (node.type === 'linebreak') return '<br>';
      if (node.type === 'text') {
        const format = typeof node.format === 'number' ? node.format : 0;
        let shown = escaped(drawing.words(node.text ?? ''));
        if (format & UNDERLINE) shown = `<u>${shown}</u>`;
        if (format & ITALIC) shown = `<em>${shown}</em>`;
        if (format & BOLD) shown = `<strong>${shown}</strong>`;
        return shown;
      }
      const inside = inlineHtml(node.children ?? [], drawing);
      if (node.type === 'link' || node.type === 'autolink') {
        const href = followable(node.fields?.url ?? '');
        return href ? `<a href="${escaped(href)}" style="color:${COLOUR.accent};text-decoration:underline">${inside}</a>` : inside;
      }
      return inside;
    })
    .join('');
}

/**
 * An image at the size made for email where there is one, at its own address
 * on this site, no wider than `room`: Outlook sizes an image by its `width`
 * attribute and ignores the CSS that would shrink it. `null` for one whose
 * file is not to hand.
 */
function image(picture: EmailImage, siteOrigin: string, room: number): string | null {
  const sized = picture.sizes?.email?.url ? picture.sizes.email : picture;
  if (!sized.url) return null;
  const src = /^https?:\/\//.test(sized.url) ? sized.url : `${siteOrigin}${sized.url}`;
  const width = Math.min(room, sized.width ?? room);
  return `<img src="${escaped(src)}" alt="${escaped(picture.alt ?? '')}" width="${width}" style="display:block;width:100%;max-width:${width}px;height:auto;border:0;outline:none;text-decoration:none">`;
}
