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
 * narrowed here — because a forbidden list is a list of the attacks somebody
 * has already thought of.
 *
 * **Nothing here parses CSS.** A stylesheet can load another file in ways a
 * regular expression finds and in ways it does not — `@import`, and `\75 rl(…)`
 * among them. So a logo carries no stylesheet at all: neither a `<style>`
 * element nor a `style` attribute, both of which a drawing program writes as
 * an alternative to the `fill` and `stroke` attributes kept here. The strip
 * draws every mark in one colour in any case.
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
 *
 * **jsdom is held at 26, and this module is never imported to boot the CMS.**
 * Both halves of that are load-bearing, and ticket 65 is what they cost when
 * they were not. jsdom 27 reaches an ES module — `@exodus/bytes`, through
 * `html-encoding-sniffer@6` — from CommonJS, with a `require()`; jsdom 26
 * reaches `whatwg-encoding`, which is CommonJS, and the call does not exist.
 * Node allows `require()` of an ES module from 22.12, and this repository runs
 * 24, so the call works here and in CI — and threw on the deployment, which
 * loads jsdom natively because Next externalises it by default rather than
 * bundling it. Because the whole CMS was loading this module to start, the
 * admin, the CMS API and every form went down with it.
 *
 * So: the Media collection imports this on the upload path only, and
 * `tests/unit/cms-boots-without-jsdom.spec.ts` holds that. Going back to
 * jsdom 27 needs the upstream chain to be CommonJS again — check
 * `html-encoding-sniffer`'s dependencies, not jsdom's version number.
 */
const { window } = new JSDOM('');
const purify = createDOMPurify(window);

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/** The drawing must still be there afterwards: an empty picture is a refusal, not an upload. */
const DRAWS = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'text', 'image', 'use'];

/**
 * Elements a logo never needs, and each a way in: script and handler run code;
 * `foreignObject` opens a window onto an HTML document; the animation elements
 * can rewrite another element's attribute after the sanitiser has read it; and
 * `style` is a stylesheet, which is a second language to sanitise.
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
  'style',
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
  ar: 'لم يبق من هذا الملف رسمة بعد إزالة ما لا يُقبل فيه. صدّره مرة أخرى رسمةً وحدها، بألوانها على الأشكال نفسها لا في ورقة أنماط.',
  en: 'Nothing was left of this file once what it may not carry was taken out. Export it again as a drawing alone, with its colours on the shapes themselves rather than in a stylesheet.',
};

export type SanitisedSvg = { readonly ok: true; readonly svg: string } | { readonly ok: false; readonly problem: Words };

/**
 * Whether a value points anywhere but into this same file. A gradient, a
 * filter or a mask the file declares is named `url(#id)` and stays; a
 * reference to another file — by `href`, or inside `url(…)` on `fill`,
 * `filter`, `mask` or `clip-path` — is a file that fetches on the visitor's
 * behalf, which is how a static logo becomes a tracker.
 */
function leavesTheFile(value: string): boolean {
  for (const [, reference] of value.matchAll(/url\(\s*['"]?([^'")]*)['"]?\s*\)/gi)) {
    if (!reference.trim().startsWith('#')) return true;
  }
  return false;
}

/** Whether an attribute names somewhere to go, which must be this file. */
function isReference(name: string): boolean {
  return name === 'href' || name === 'xlink:href';
}

export function sanitisedSvg(source: string): SanitisedSvg {
  const written = source.trim();
  if (written === '' || !/<svg[\s>]/i.test(written)) return { ok: false, problem: NOT_AN_SVG };

  // Refused rather than stripped: an entity is resolved by the parser, so by
  // the time anything here could take it out, a file off the server may
  // already be sitting in the text.
  if (/<!DOCTYPE|<!ENTITY/i.test(written)) return { ok: false, problem: DECLARES_ENTITIES };

  // The DOM DOMPurify itself produced, rather than its markup parsed a second
  // time: re-parsing a sanitiser's own output is the shape that has carried
  // attacks past sanitisers before.
  // `RETURN_DOM` hands back the element DOMPurify built; it is typed as a
  // `Node`, and what it always is here is an element with the drawing inside.
  const holder = purify.sanitize(written, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: NEVER,
    FORBID_ATTR: ['style'],
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: true,
  }) as unknown as Element;

  const root = holder.querySelector('svg');
  if (!root) return { ok: false, problem: NOTHING_LEFT };

  for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const attribute of Array.from(element.attributes) as Attr[]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value ?? '';
      const away = isReference(name) ? !value.trim().startsWith('#') : leavesTheFile(value);
      // A handler under a name DOMPurify did not know, and anything pointing
      // out of this file, whatever attribute carries it.
      if (name.startsWith('on') || away) element.removeAttribute(attribute.name);
    }
  }

  if (!DRAWS.some((tag) => root.querySelector(tag) !== null)) return { ok: false, problem: NOTHING_LEFT };

  // The namespace is declared, because the file is served as XML and a
  // drawing without it is a broken image; and it is serialised as XML for the
  // same reason, so that a non-breaking space is stored as the character
  // rather than as an HTML name no XML parser knows.
  if (root.getAttribute('xmlns') !== SVG_NAMESPACE) root.setAttribute('xmlns', SVG_NAMESPACE);
  return { ok: true, svg: new window.XMLSerializer().serializeToString(root) };
}
