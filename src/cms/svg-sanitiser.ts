/**
 * Every SVG an Editor uploads passes through here first (ticket 20, ADR-0010).
 *
 * A client's logo arrives as a vector often enough that refusing SVG would
 * send Ahmed to a designer each time one is signed. But an SVG is a document,
 * not a picture: it can carry script, fetch other files, and open a window
 * onto another document. Served from this site's own domain, all of that would
 * run with this site's authority — a visitor's session included. The site
 * draws a logo in an `<img>`, where a browser runs none of it, but the file
 * keeps its own address, and following that address is enough.
 *
 * So what is stored is not what was uploaded: it is what survives this. The
 * rule is an allowed list, not a forbidden one — DOMPurify's SVG profile,
 * narrowed further here — because a forbidden list is a list of the attacks
 * somebody has already thought of.
 *
 * `tests/unit/svg-sanitiser.spec.ts` states case by case what must not
 * survive.
 */
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { Words } from './page-fields';

/**
 * DOMPurify needs a DOM to work in, and jsdom is the one it is tested
 * against: another (happy-dom was tried) parses `<svg>` into the HTML
 * namespace, where DOMPurify rightly refuses it and the drawing's own root —
 * its `viewBox` with it — is thrown away.
 *
 * One window for the process: building it costs more than the sanitising
 * does, and nothing here keeps state between files.
 */
const { window } = new JSDOM('');
const purify = createDOMPurify(window);

/** The drawing must still be there afterwards: an empty picture is a refusal, not an upload. */
const DRAWS = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'text', 'image', 'use'];

/**
 * Elements a logo never needs, and each a way in: script and handler run code;
 * `foreignObject` opens a window onto an HTML document; the animation elements
 * can rewrite another element's attribute after the sanitiser has read it.
 */
const NEVER = [
  'script',
  'foreignObject',
  'iframe',
  'embed',
  'object',
  'handler',
  'animate',
  'animateTransform',
  'animateMotion',
  'set',
  'audio',
  'video',
];

const NOT_AN_SVG: Words = {
  ar: 'هذا الملف ليس رسمة SVG. ارفع ملف SVG أو صورة PNG.',
  en: 'This file is not an SVG drawing. Upload an SVG, or a PNG image.',
};

const DECLARES_ENTITIES: Words = {
  ar: 'ملف SVG فيه تعريف مستند (DOCTYPE أو ENTITY) لا يُقبل: يمكن أن يقرأ ملفات من الخادم. صدّره من برنامج الرسم من دونه.',
  en: 'This SVG carries a document declaration (DOCTYPE or ENTITY), which can read files off the server. Export it again from your drawing program without one.',
};

const NOTHING_LEFT: Words = {
  ar: 'لم يبق من هذا الملف رسمة بعد إزالة ما لا يُقبل فيه. صدّره مرة أخرى رسمةً وحدها.',
  en: 'Nothing was left of this file once what it may not carry was taken out. Export it again as a drawing alone.',
};

export type SanitisedSvg = { readonly ok: true; readonly svg: string } | { readonly ok: false; readonly problem: Words };

/**
 * A reference this file may keep: its own, by name. Anything else — another
 * file, another site — is a file that fetches on the visitor's behalf, which
 * is how a static logo becomes a tracker.
 */
function isOwnReference(value: string | null): boolean {
  return typeof value === 'string' && value.trim().startsWith('#');
}

/**
 * Whatever a stylesheet loads from elsewhere, dropped. A gradient or a filter
 * this file declares is named `url(#id)` and stays.
 */
function withoutLoadedStyles(css: string): string {
  return css.replace(/url\(\s*(['"]?)(?!#)[^)]*\1\s*\)/gi, 'none');
}

export function sanitisedSvg(source: string): SanitisedSvg {
  const written = source.trim();
  if (written === '' || !/<svg[\s>]/i.test(written)) return { ok: false, problem: NOT_AN_SVG };

  // Refused rather than stripped: an entity is resolved by the parser, so by
  // the time anything here could take it out, a file off the server may
  // already be sitting in the text.
  if (/<!DOCTYPE|<!ENTITY/i.test(written)) return { ok: false, problem: DECLARES_ENTITIES };

  const purified = purify.sanitize(written, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: NEVER,
    // Every handler, whatever it is called: `onload`, `onclick`, and the ones
    // this list would not have thought of.
    ALLOW_DATA_ATTR: false,
  });

  const holder = window.document.createElement('div');
  holder.innerHTML = purified;
  const root = holder.querySelector('svg');
  if (!root) return { ok: false, problem: NOTHING_LEFT };

  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith('on')) element.removeAttribute(attribute.name);
      if ((name === 'href' || name === 'xlink:href') && !isOwnReference(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
      if (name === 'style') element.setAttribute('style', withoutLoadedStyles(attribute.value ?? ''));
    }
    if (element.tagName.toLowerCase() === 'style') {
      element.textContent = withoutLoadedStyles(element.textContent ?? '');
    }
  }

  const draws = DRAWS.some((tag) => root.querySelector(tag) !== null);
  if (!draws) return { ok: false, problem: NOTHING_LEFT };

  return { ok: true, svg: root.outerHTML };
}
