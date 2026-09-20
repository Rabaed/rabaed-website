/**
 * The sanitiser every uploaded SVG passes through (ticket 20, ADR-0010).
 *
 * Tested directly rather than through the running site, as the delay-cost
 * formula is: it is a pure function of text, with no I/O, and what matters
 * about it is the long list of things it must strip — a list far cheaper to
 * state here than to drive through an upload form one file at a time. That an
 * upload actually reaches it is asked in `tests/e2e/trust-strip.spec.ts`.
 *
 * An SVG is a document, not a picture: it can carry script, fetch other
 * documents, and — served from the site's own domain — do both with the
 * site's authority. Every case below is a way that has been used in the wild.
 */
import { test, expect } from '@playwright/test';
import { sanitisedSvg } from '../../src/cms/svg-sanitiser';

/** The sanitised markup, or the reason it was refused. */
function cleaned(source: string): string {
  const result = sanitisedSvg(source);
  if (!result.ok) throw new Error(`refused: ${result.problem.en}`);
  return result.svg;
}

const LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><path d="M0 0h100v40H0z" fill="#1B1E27"/></svg>';

test('an ordinary logo comes through with its drawing intact', () => {
  const svg = cleaned(LOGO);

  expect(svg).toContain('<path');
  expect(svg).toContain('d="M0 0h100v40H0z"');
  expect(svg).toContain('fill="#1B1E27"');
  expect(svg).toContain('viewBox="0 0 100 40"');
});

test('the shapes a logo is drawn from all survive', () => {
  const drawing =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
    '<g><circle cx="5" cy="5" r="4"/><rect x="1" y="1" width="2" height="2"/>' +
    '<ellipse cx="5" cy="5" rx="2" ry="1"/><polygon points="0,0 1,1 2,0"/>' +
    '<polyline points="0,0 1,1"/><line x1="0" y1="0" x2="1" y2="1"/>' +
    '<defs><linearGradient id="g"><stop offset="0" stop-color="#fff"/></linearGradient></defs>' +
    '<text x="1" y="2">Rabaed</text></g></svg>';
  const svg = cleaned(drawing);

  for (const tag of ['circle', 'rect', 'ellipse', 'polygon', 'polyline', 'line', 'linearGradient', 'stop', 'text', 'g']) {
    expect(svg, tag).toContain(`<${tag}`);
  }
  expect(svg).toContain('Rabaed');
});

test('a script in the file is taken out', () => {
  const svg = cleaned(`<svg xmlns="http://www.w3.org/2000/svg"><script>fetch('/maktab')</script>${LOGO}</svg>`);

  expect(svg).not.toContain('<script');
  expect(svg).not.toContain('fetch(');
});

test('a handler on an element is taken out', () => {
  const handlers = [
    '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(1)"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><rect onmouseover="alert(1)"/></svg>',
    // An animation element is taken out whole; the drawing beside it is why
    // this file is still a logo afterwards.
    '<svg xmlns="http://www.w3.org/2000/svg"><animate onbegin="alert(1)"/><path d="M0 0h1v1H0z"/></svg>',
  ];
  for (const source of handlers) {
    const svg = cleaned(source);
    expect(svg.toLowerCase(), source).not.toContain('alert(1)');
    expect(svg.toLowerCase(), source).not.toMatch(/\son[a-z]+=/);
  }
});

test('a link that runs script rather than leading somewhere is taken out', () => {
  const svg = cleaned('<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><rect/></a></svg>');

  expect(svg.toLowerCase()).not.toContain('javascript:');
});

test('a window onto another document is taken out', () => {
  const svg = cleaned(
    '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><body xmlns="http://www.w3.org/1999/xhtml">' +
      '<iframe src="https://example.test"></iframe></body></foreignObject><rect/></svg>',
  );

  expect(svg.toLowerCase()).not.toContain('foreignobject');
  expect(svg.toLowerCase()).not.toContain('<iframe');
});

test('a file that fetches another file is taken out', () => {
  const svg = cleaned(
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<image href="https://example.test/tracker.png"/>' +
      '<use href="https://example.test/payload.svg#x"/>' +
      '<rect/></svg>',
  );

  expect(svg).not.toContain('https://example.test');
});

test('a stylesheet is taken out whole, and colour on the shape itself stays', () => {
  // Not sanitised, removed: CSS is a second language, and it loads another
  // file in ways a regular expression finds and ways it does not — `@import`,
  // and `= rl(…)`, which spells `url(` in escapes. A drawing program writes
  // `fill` on the shape instead, which is what the strip keeps.
  const svg = cleaned(
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<style>@import "https://example.test/x.css"; .a{fill:red}</style>' +
      '<rect class="a" style="fill:\\75 rl(https://example.test/x.png)" fill="#FFFFFF"/></svg>',
  );

  expect(svg).not.toContain('example.test');
  expect(svg.toLowerCase()).not.toContain('<style');
  expect(svg.toLowerCase()).not.toContain('@import');
  expect(svg.toLowerCase()).not.toContain('style=');
  expect(svg).toContain('fill="#FFFFFF"');
});

test('a shape painted from another file loses the paint, whatever attribute carries it', () => {
  // `fill`, `filter`, `mask` and `clip-path` all take `url(…)`, and none of
  // them is a link, so none was checked as one until the review of 20
  // September 2026 found them.
  const svg = cleaned(
    '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="own"><stop offset="0" stop-color="#fff"/></linearGradient></defs>' +
      '<path d="M0 0h1v1H0z" fill="url(https://example.test/paint.svg#g)"/>' +
      '<path d="M0 0h1v1H0z" filter="url(https://example.test/f.svg#f)"/>' +
      '<path d="M0 0h1v1H0z" mask="url(https://example.test/m.svg#m)"/>' +
      '<path d="M0 0h1v1H0z" clip-path="url(https://example.test/c.svg#c)"/>' +
      '<path d="M0 0h1v1H0z" fill="url(#own)"/></svg>',
  );

  expect(svg).not.toContain('example.test');
  // Its own gradient, named in the same file, is untouched.
  expect(svg).toContain('url(#own)');
  expect(svg).toContain('<linearGradient');
});

test('what is stored is XML a browser can parse: its namespace declared, its characters its own', () => {
  const svg = cleaned('<svg viewBox="0 0 10 10"><text> Rabaed</text><path d="M0 0h1v1H0z"/></svg>');

  expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  // `&nbsp;` is an HTML name; an XML parser does not know it, and a file
  // carrying one is a broken image.
  expect(svg).not.toContain('&nbsp;');
});

test('a document type declaration, which can read files off the server, is refused', () => {
  const entity =
    '<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' +
    '<svg xmlns="http://www.w3.org/2000/svg"><text>&xxe;</text></svg>';
  const result = sanitisedSvg(entity);

  expect(result.ok).toBe(false);
});

test('a file that is not an SVG at all is refused', () => {
  for (const source of ['<html><body>hello</body></html>', 'PNG\r\n\n', '', '   ']) {
    expect(sanitisedSvg(source).ok, JSON.stringify(source)).toBe(false);
  }
});

test('a file whose drawing is entirely stripped is refused rather than stored empty', () => {
  const result = sanitisedSvg('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

  expect(result.ok).toBe(false);
});

test('the sanitiser is settled: running it on its own output changes nothing', () => {
  const once = cleaned(`<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>x()</script>${LOGO}</svg>`);

  expect(cleaned(once)).toBe(once);
});
