import { LanguageSwitcher } from '@/components/language-switcher';
import { NavBehaviour } from '@/components/nav-behaviour';
import { getHeader } from '@/content/site-words';
import { localePath, type Locale } from '@/lib/locales';

/**
 * The button that opens the panel below 1100px. It draws three lines and no
 * words, so its accessible name is the only thing that says what it is — and
 * it was Arabic on every page, English ones included, until ticket 40. Not an
 * Editor's words: it names a control, and it is never seen.
 */
const MENU_LABEL: Record<Locale, string> = { ar: 'القائمة', en: 'Menu' };

/**
 * What the wordmark is called, which is what a screen reader reads for the
 * link home: both names in Arabic, as the mark draws them, and Rabaed alone in
 * English, as the footer's wordmark is named there (ticket 42).
 */
const WORDMARK: Record<Locale, string> = { ar: 'ربائد — Rabaed', en: 'Rabaed' };

/**
 * What a page may change about the header it sits under (ticket 104). Only the
 * Company profile changes anything; every other page passes nothing, and its
 * header is exactly the one every page had before.
 */
export type PageHeader = {
  /** A button of the page's own, beside Sign in, on the bar and in the panel. */
  readonly button?: HeaderDownload;
  /**
   * Where "Book a live demo" goes, on a page with no demo form of its own to
   * jump to. Unsaid, it is `#demo`, the form on the page itself.
   */
  readonly demoHref?: string;
  /**
   * How the header colours itself as the page scrolls (`nav-behaviour.tsx`).
   * Unsaid, as on every page, light from the first light section until the
   * footer; `each-section`, following the section beneath it all the way
   * down, as the Company profile does, whose sections turn dark again after
   * light ones (the founder's decision, 4 November 2026).
   */
  readonly colours?: 'each-section';
};

/** One file a download gives: where it is, and the name a visitor's browser saves it under. */
export type DownloadFile = { readonly href: string; readonly name: string };

/**
 * What the header's own button downloads, each file under its own name: one
 * for a screen wider than 980px — which is also what every screen gets
 * without JavaScript — and one for a screen 980px wide or less, which the
 * button changes to as the screen does (`nav-behaviour.tsx`).
 */
export type HeaderDownload = { readonly label: string; readonly desktop: DownloadFile; readonly phone: DownloadFile };

/** The download arrow beside the button's words, Ahmed's. Decorative: the words name it. */
function DownloadIcon() {
  return (
    <svg className="pdf-i" viewBox="0 0 24 24" width={15} height={15} aria-hidden="true">
      <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" />
    </svg>
  );
}

/**
 * The button itself, on the bar or in the panel. It names both files, and
 * carries the desktop one: the server cannot know the screen, so a page read
 * without JavaScript gives the desktop file, and the script swaps in the
 * phone one where the screen asks for it.
 *
 * `download` names the file the browser saves: an Editor's replacement under
 * the name it was uploaded with (`profile-files`), Ahmed's under his. The
 * files are the site's own, served with no name of their own
 * (`Content-Disposition`), so this is the name the visitor gets.
 */
function DownloadButton({ button, className }: { button: HeaderDownload; className: string }) {
  const { desktop, phone } = button;
  return (
    <a
      className={className}
      href={desktop.href}
      download={desktop.name}
      data-desktop-href={desktop.href}
      data-desktop-name={desktop.name}
      data-phone-href={phone.href}
      data-phone-name={phone.name}
    >
      <DownloadIcon />
      {button.label}
    </a>
  );
}

/**
 * The site header: brand, primary links, the Partnerships dropdown, the sign-in
 * link and the demo call to action, plus the panel that replaces all of it
 * below 1100px.
 *
 * A server component. The markup — every link, every label — is in the first
 * response; `NavBehaviour` only adds the opening and closing on top of it
 * (ADR-0001).
 *
 * Both mobile and desktop menus are rendered, and CSS decides which is shown.
 * That is the Reference site's arrangement and it is the right one: the
 * alternative is measuring the viewport in JavaScript, which cannot be done
 * on the server and so would leave one of the two menus missing from the HTML
 * a crawler reads.
 *
 * Every label, and where every link goes, is read from the CMS (ticket 59),
 * as is whether case studies have a link yet; publishing anything rebuilds
 * every page (`src/cms/revalidation.ts`).
 */
export async function SiteNav({
  locale,
  path,
  ownPath,
  locales,
  header = {},
}: {
  locale: Locale;
  /** The section whose link in the menu is marked as the one being read. */
  path: string;
  /** This page's own address, which the switcher offers in the other language. */
  ownPath: string;
  /** The languages this page exists in, for the switcher (ticket 40). */
  locales: readonly Locale[];
  /** What this page changes about the header, if anything (ticket 104). */
  header?: PageHeader;
}) {
  const { links, partnershipsLabel, partnerships, signIn, demoLabel } = await getHeader(locale);
  const inPartnerships = partnerships.some((link) => link.path === path);

  return (
    // The attribute only where a page asks for it, so every other page's
    // header is the markup it always was, down to what React is sent.
    <nav className="nav" {...(header.colours === 'each-section' && { 'data-colours': 'each-section' })}>
      <div className="wrap">
        {/* The wordmark leads home whatever the menu says: it is the site's
            own mark, not one of the links an Editor orders. */}
        <a className="brand" href={localePath(locale, '/')}>
          {/* Two wordmarks, cross-faded by `.nav.on-light`: one legible on the
              dark sections, one on the light. The second is decorative — the
              first already names the site. */}
          <img className="lg d" src="/brand/rabaed-wordmark-on-dark.webp" alt={WORDMARK[locale]} width={563} height={210} />
          <img className="lg l" src="/brand/rabaed-wordmark-on-light.webp" alt="" width={563} height={210} />
        </a>

        <div className="links">
          {links.map((link) => (
            <a key={link.path} href={link.href} className={link.path === path ? 'on' : undefined}>
              {link.label}
            </a>
          ))}

          <div className={inPartnerships ? 'nsub on' : 'nsub'}>
            <button className="nsub-t" type="button" aria-expanded="false" aria-haspopup="true">
              {partnershipsLabel}
              <span className="ar">▾</span>
            </button>
            <div className="nsub-p">
              {partnerships.map((link) => (
                <a key={link.path} href={link.href} className={link.path === path ? 'on' : undefined}>
                  <b>{link.label}</b>
                  <span>{link.summary}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-cta">
          <LanguageSwitcher locale={locale} path={ownPath} locales={locales} variant="bar" />
          <a className="login" href={signIn.href} target="_blank" rel="noopener">
            {signIn.label}
          </a>
          {header.button && <DownloadButton button={header.button} className="pdf" />}
          {/* On the home page this jumps to the demo request form (ticket 11).
              On a page without the form it goes nowhere, which is what the
              Reference site does on its sub-pages too — unless the page says
              where it goes instead, as the Company profile does (ticket 104). */}
          <a className="btn p" href={header.demoHref ?? '#demo'}>
            {demoLabel}
          </a>
          <button className="navtog" type="button" aria-label={MENU_LABEL[locale]} aria-expanded="false" aria-controls="mnav">
            <i />
          </button>
        </div>
      </div>

      <div className="mnav" id="mnav">
        <div className="wrap">
          {links.map((link) => (
            <a key={link.path} href={link.href} className={link.path === path ? 'on' : undefined}>
              {link.label}
            </a>
          ))}
          <div className="msub">
            <span className="msub-t">{partnershipsLabel}</span>
            {partnerships.map((link) => (
              <a key={link.path} href={link.href} className={link.path === path ? 'on' : undefined}>
                {link.label}
              </a>
            ))}
          </div>
          {/* Login and the language on one row, on opposite sides, and the
              switcher's note — where a page has no translation — on a line
              of its own under them (ticket 76, ADR-0020). */}
          <div className="mrow">
            <a className="mlogin" href={signIn.href} target="_blank" rel="noopener">
              {signIn.label}
            </a>
            {header.button && <DownloadButton button={header.button} className="mpdf pdf" />}
            <LanguageSwitcher locale={locale} path={ownPath} locales={locales} variant="panel" />
          </div>
        </div>
      </div>

      {/* The page behind the open panel, dimmed; a tap on it closes the panel
          (ticket 76). Decorative to a screen reader, which has Escape and the
          menu button for that. */}
      <div className="mscrim" aria-hidden="true" />

      <NavBehaviour />
    </nav>
  );
}
