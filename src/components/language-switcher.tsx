import { LOCALE_CODES, LOCALES, localePath, type Locale } from '@/lib/locales';

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

/**
 * What the link says, and what it says when this page is not in that language.
 *
 * **In the code rather than the CMS, unlike every other word a visitor reads
 * (ticket 59).** A language is named in its own language or it is not
 * recognised by the person looking for it, so `name` is not a wording anyone
 * should be able to change. `missing` is a sentence a visitor does read, and
 * it is here on a narrower argument: it describes what the link does, not
 * anything about Rabaed, and it exists in both languages before either
 * language's words are in the CMS at all — which is the state this ticket
 * leaves the site in. Ticket 42 puts the English site's words in the CMS; if
 * `missing` should join them, that is the ticket to do it in.
 */
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
 * nothing else; `panel` is the menu behind the button below 1100px, where the
 * sentence fits and is shown rather than left to the link's accessible name.
 */
type Variant = 'bar' | 'panel';

/**
 * The panel's note, which the link names as its description. One per page:
 * the bar has no note, and there is one panel.
 */
const NOTE_ID = 'mlang-n';

/**
 * A small globe, beside the language's name in the panel (ticket 76), so the
 * link reads as a way to another language rather than as one more menu link.
 * Decorative: the words beside it already say what the link is.
 */
function Globe() {
  return (
    <svg className="mlang-g" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8h13M8 1.5c1.9 1.8 2.8 4 2.8 6.5S9.9 12.7 8 14.5M8 1.5C6.1 3.3 5.2 5.5 5.2 8s.9 4.7 2.8 6.5" />
    </svg>
  );
}

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
  // (`src/lib/locales.ts`), and a search rather than a table is what says so.
  // A third locale would make "the other one" meaningless, and this would then
  // offer whichever of the two it found first — so it draws nothing instead,
  // and a switcher missing from every header is the signal. Adding a third
  // locale means deciding what this should do before it will work at all.
  const other = LOCALE_CODES.find((code) => code !== locale);
  if (!other) return null;

  const words = WORDS[other];
  const here = locales.includes(other);
  const href = localePath(other, here ? path : '/');
  const panel = variant === 'panel';

  const link = (
    <a
      className={panel ? 'mlang' : 'lang'}
      href={href}
      // The language of the words on the link, not of the page it leads to —
      // though here they are the same — so a screen reader pronounces
      // «العربية» as Arabic in an English page's header.
      lang={other}
      hrefLang={other}
      // Read by `NavBehaviour`, which remembers the choice when it is followed.
      data-language={other}
      // The explanation reaches a screen reader on both variants, because a
      // link whose only difference is where it goes is not one it can tell
      // apart. The bar has no room to show it, so it is the link's name there;
      // the panel shows it, so there it is the link's description, and read
      // once rather than twice.
      aria-label={here || panel ? undefined : `${words.name} — ${words.missing}`}
      aria-describedby={here || !panel ? undefined : NOTE_ID}
    >
      {panel ? <Globe /> : null}
      {words.name}
    </a>
  );

  if (here || !panel) return link;

  // In the panel the note sits under the row the link shares with Login,
  // across the panel's width (ticket 76) — so it is the link's sibling, not
  // inside it, and the row wraps it onto a line of its own. It is written in
  // the other language, so it runs in that language's direction too: an
  // English sentence laid out right to left puts its full stop at the start.
  return (
    <>
      {link}
      <small className="mlang-n" id={NOTE_ID} lang={other} dir={LOCALES[other].dir}>
        {words.missing}
      </small>
    </>
  );
}
