import { LOCALE_CODES, localePath, type Locale } from '@/lib/locales';

/**
 * The link that takes a visitor to this page in the other language (ticket 40).
 *
 * A server component, like the rest of the header: the link, its address and
 * its words are all in the first response, so a visitor who wants the other
 * language has it before any JavaScript runs and a crawler reads the same
 * thing they do (ADR-0001). `NavBehaviour` only remembers the choice on top
 * of it, and remembering is all it does — nobody is ever redirected
 * (ADR-0014).
 *
 * **Where the page has no counterpart, the link still goes somewhere real.**
 * Eight of the eleven Arabic pages are Arabic-only for now, and an article or
 * a case study may be published in one language and not the other. Rather than
 * disappear — which tells an English reader the site has no English at all —
 * or lead to a page that is not there, the link leads to that language's home
 * page and says so. The saying is the point: sent somewhere they did not ask
 * for without a word, a visitor reads it as the site being broken.
 *
 * Each language is named in its own language, which is what a reader looking
 * for it recognises: somebody who reads only English does not know what
 * «الإنجليزية» says.
 */

/** What the link says, and what it says when this page is not in that language. */
const WORDS = {
  ar: {
    name: 'العربية',
    /** Reached when an entry is published in English and not in Arabic. */
    missing: 'هذه الصفحة غير متوفّرة بالعربية. هذا الرابط يفتح الصفحة الرئيسية بالعربية.',
  },
  en: {
    name: 'English',
    missing: 'This page is not available in English yet. This link opens the English home page.',
  },
} as const satisfies Record<Locale, unknown>;

/**
 * `bar` is the header's own row, where there is room for the language and
 * nothing else; `panel` is the menu behind the button below 981px, where the
 * sentence fits and is shown rather than left to the link's accessible name.
 */
type Variant = 'bar' | 'panel';

export function LanguageSwitcher({
  locale,
  path,
  locales,
  variant,
}: {
  /** The language being read now. */
  locale: Locale;
  /** This page's locale-independent path, as `PageShell` is given it. */
  path: string;
  /** The languages this page exists in — the same fact `pageMetadata` turns into `hreflang`. */
  locales: readonly Locale[];
  variant: Variant;
}) {
  // Two locales, so "the other one" is a fact rather than a choice
  // (`src/lib/locales.ts`). Written as a search so that a third would fail
  // here, loudly, rather than quietly showing the wrong language.
  const other = LOCALE_CODES.find((code) => code !== locale);
  if (!other) return null;

  const words = WORDS[other];
  const here = locales.includes(other);
  const href = localePath(other, here ? path : '/');

  return (
    <a
      className={variant === 'bar' ? 'lang' : 'mlang'}
      href={href}
      // The language of the words on the link, not of the page it leads to —
      // though here they are the same — so a screen reader pronounces
      // «العربية» as Arabic in an English page's header.
      lang={other}
      hrefLang={other}
      // Read by `NavBehaviour`, which remembers the choice when it is followed.
      data-language={other}
      // The accessible name carries the explanation on both variants, because
      // the bar has no room to show it and a link whose only difference is
      // where it goes is not one a screen reader can tell apart.
      aria-label={here ? undefined : `${words.name} — ${words.missing}`}
    >
      {words.name}
      {!here && variant === 'panel' ? <small className="mlang-n">{words.missing}</small> : null}
    </a>
  );
}
