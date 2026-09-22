import { LanguageSwitcher } from '@/components/language-switcher';
import { NavBehaviour } from '@/components/nav-behaviour';
import { getHeader } from '@/content/site-words';
import { LOCALE_CODES, localePath, type Locale } from '@/lib/locales';

/**
 * The button that opens the panel below 1100px. It draws three lines and no
 * words, so its accessible name is the only thing that says what it is — and
 * it was Arabic on every page, English ones included, until ticket 40. Not an
 * Editor's words: it names a control, and it is never seen.
 */
const MENU_LABEL: Record<Locale, string> = { ar: 'القائمة', en: 'Menu' };

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
  ownPath = path,
  locales = LOCALE_CODES,
}: {
  locale: Locale;
  /** The section whose link in the menu is marked as the one being read. */
  path: string;
  /** This page's own address, which the switcher offers in the other language. */
  ownPath?: string;
  /** The languages this page exists in, for the switcher (ticket 40). */
  locales?: readonly Locale[];
}) {
  const { links, partnershipsLabel, partnerships, signIn, demoLabel } = await getHeader(locale);
  const inPartnerships = partnerships.some((link) => link.path === path);

  return (
    <nav className="nav">
      <div className="wrap">
        {/* The wordmark leads home whatever the menu says: it is the site's
            own mark, not one of the links an Editor orders. */}
        <a className="brand" href={localePath(locale, '/')}>
          {/* Two wordmarks, cross-faded by `.nav.on-light`: one legible on the
              dark sections, one on the light. The second is decorative — the
              first already names the site. */}
          <img className="lg d" src="/brand/rabaed-wordmark-on-dark.webp" alt="ربائد — Rabaed" width={563} height={210} />
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
          {/* On the home page this jumps to the demo request form (ticket 11).
              On a page without the form it goes nowhere, which is what the
              Reference site does on its sub-pages too. */}
          <a className="btn p" href="#demo">
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
          <a className="mlogin" href={signIn.href} target="_blank" rel="noopener">
            {signIn.label}
          </a>
          <LanguageSwitcher locale={locale} path={ownPath} locales={locales} variant="panel" />
        </div>
      </div>

      <NavBehaviour />
    </nav>
  );
}
