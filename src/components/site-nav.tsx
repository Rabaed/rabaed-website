import { NavBehaviour } from '@/components/nav-behaviour';
import {
  PARTNERSHIP_LABEL,
  PARTNERSHIP_LINKS,
  PRIMARY_LINKS,
  SIGN_IN_LABEL,
  SIGN_IN_URL,
} from '@/content/navigation';
import { localePath, type Locale } from '@/lib/locales';

/**
 * The site header: brand, primary links, the Partnerships dropdown, the sign-in
 * link and the demo call to action, plus the panel that replaces all of it
 * below 981px.
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
 */
export function SiteNav({ locale, path }: { locale: Locale; path: string }) {
  const href = (to: string) => localePath(locale, to);
  const inPartnerships = PARTNERSHIP_LINKS.some((link) => link.path === path);

  return (
    <nav className="nav">
      <div className="wrap">
        <a className="brand" href={href('/')}>
          {/* Two wordmarks, cross-faded by `.nav.on-light`: one legible on the
              dark sections, one on the light. The second is decorative — the
              first already names the site. */}
          <img className="lg d" src="/brand/rabaed-wordmark-on-dark.png" alt="ربائد — Rabaed" width={563} height={210} />
          <img className="lg l" src="/brand/rabaed-wordmark-on-light.png" alt="" width={563} height={210} />
        </a>

        <div className="links">
          {PRIMARY_LINKS.map((link) => (
            <a key={link.path} href={href(link.path)} className={link.path === path ? 'on' : undefined}>
              {link.label}
            </a>
          ))}

          <div className={inPartnerships ? 'nsub on' : 'nsub'}>
            <button className="nsub-t" type="button" aria-expanded="false" aria-haspopup="true">
              {PARTNERSHIP_LABEL}
              <span className="ar">▾</span>
            </button>
            <div className="nsub-p">
              {PARTNERSHIP_LINKS.map((link) => (
                <a key={link.path} href={href(link.path)} className={link.path === path ? 'on' : undefined}>
                  <b>{link.label}</b>
                  <span>{link.summary}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-cta">
          <a className="login" href={SIGN_IN_URL} target="_blank" rel="noopener">
            {SIGN_IN_LABEL}
          </a>
          {/* The demo form is ticket 27, and the section that holds it is
              ticket 11. Until then this anchor has nothing to jump to, which
              is what the Reference site does on its sub-pages too. */}
          <a className="btn p" href="#demo">
            احجز عرضاً حياً
          </a>
          <button className="navtog" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="mnav">
            <i />
          </button>
        </div>
      </div>

      <div className="mnav" id="mnav">
        <div className="wrap">
          {PRIMARY_LINKS.map((link) => (
            <a key={link.path} href={href(link.path)} className={link.path === path ? 'on' : undefined}>
              {link.label}
            </a>
          ))}
          <div className="msub">
            <span className="msub-t">{PARTNERSHIP_LABEL}</span>
            {PARTNERSHIP_LINKS.map((link) => (
              <a key={link.path} href={href(link.path)} className={link.path === path ? 'on' : undefined}>
                {link.label}
              </a>
            ))}
          </div>
          <a className="mlogin" href={SIGN_IN_URL} target="_blank" rel="noopener">
            {SIGN_IN_LABEL}
          </a>
        </div>
      </div>

      <NavBehaviour />
    </nav>
  );
}
