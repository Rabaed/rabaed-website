import { getContactPoints } from '@/cms/contact-points';
import { getFooter } from '@/content/site-words';
import type { Locale } from '@/lib/locales';

/**
 * The names a screen reader gives the wordmark and the icons, which draw no
 * words of their own. Arabic on every page until ticket 40 gave English pages
 * a footer. Not an Editor's words: they name a brand and five services, and are
 * never seen.
 */
const NAMES = {
  ar: { brand: 'ربائد', linkedin: 'لينكدإن', x: 'إكس', facebook: 'فيسبوك', instagram: 'إنستجرام', whatsapp: 'واتساب', directory: 'روابط الموقع' },
  en: { brand: 'Rabaed', linkedin: 'LinkedIn', x: 'X', facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', directory: 'Site links' },
} as const satisfies Record<Locale, unknown>;

/**
 * The site footer. Byte-identical across all nine Reference pages, which is
 * why it is one component here.
 *
 * DIVERGENCE FROM THE REFERENCE SITE, deliberate, and the founder's
 * (ADR-0020): between the social icons and the rights line sits the Footer
 * directory, four columns of links through which every page can be reached.
 * The Reference site's footer has a row of two legal links there instead,
 * which became the directory's Legal column. Everything above and below it is
 * the Reference site's footer as it was.
 *
 * Its lines, its columns and the labels on its links are read from the CMS (ticket 59);
 * the WhatsApp number and the social accounts are site settings (ticket 19).
 * An account nobody has supplied yet keeps the Reference site's `#`, rather
 * than losing its icon: the accounts are awaiting the founders, and ticket 39
 * will not let the site go public with them empty.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [contact, { tagline, directory, rights }] = await Promise.all([getContactPoints(), getFooter(locale)]);
  const names = NAMES[locale];

  return (
    <footer>
      <div className="wrap">
        <div className="brand foot">
          <img className="lg" src="/brand/rabaed-wordmark-on-dark.webp" alt={names.brand} width={563} height={210} />
        </div>
        <div>{tagline}</div>
        <div className="social">
          <a href={contact.social.linkedin ?? '#'} aria-label={names.linkedin} target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.8 8.4h3v10.8h-3zM6.3 4.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10.3 8.4h2.9v1.5c.6-1 1.7-1.7 3.2-1.7 2.6 0 3.8 1.6 3.8 4.5v6.5h-3v-5.8c0-1.5-.5-2.4-1.8-2.4-1.1 0-1.8.8-2.1 1.6-.1.3-.1.7-.1 1v5.6h-2.9z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.x ?? '#'} aria-label={names.x} target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.53 3h3.13l-6.84 7.82L22 21h-6.3l-4.93-6.44L5.13 21H2l7.31-8.36L2 3h6.46l4.46 5.89L17.53 3zm-1.1 16.14h1.74L7.66 4.77H5.8l10.63 14.37z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.facebook ?? '#'} aria-label={names.facebook} target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13.6 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.8V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.6V13h2.7v8z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.instagram ?? '#'} aria-label={names.instagram} target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.whatsappUrl} aria-label={names.whatsapp} target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3.6a8.3 8.3 0 0 0-7.1 12.6L3.8 20.4l4.3-1.1A8.3 8.3 0 1 0 12 3.6z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9.4 8.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .6l-.4.5c-.1.2-.2.3-.1.5.4.8 1.3 1.7 2.2 2.1.2.1.4.1.5-.1l.5-.5c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.3.3.5v.5c0 .5-.4.9-.9 1-1 .2-2.5-.2-4.1-1.6s-2.2-2.9-2.4-3.9c-.1-.5.1-1 .5-1.3z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
      <nav className="wrap foot-dir" aria-label={names.directory}>
        {directory.map((column, place) => (
          <div key={place} className="foot-col">
            <h2>{column.heading}</h2>
            <ul>
              {column.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} hrefLang={link.hrefLang}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="wrap foot-bar">
        {/* DIVERGENCE FROM THE REFERENCE SITE, deliberate.
            The Reference site puts the whole line inside `.mono`, so the
            Arabic in it is set in DM Mono — a face with no Arabic glyphs at
            all. What a visitor sees is the browser's last-resort serif,
            monospaced and disjointed, which is precisely the failure the spec
            forbids: "DM Mono for Latin numerals only ... must never be applied
            to Arabic text". Only the year is Latin, so only the year is mono. */}
        <div>
          © <span className="mono">2026</span> {rights}
        </div>
      </div>
    </footer>
  );
}
