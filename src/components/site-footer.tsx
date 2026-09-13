import { getContactPoints } from '@/cms/contact-points';
import { FOOTER_LEGAL_LINKS } from '@/content/navigation';
import { localePath, type Locale } from '@/lib/locales';

/**
 * The site footer. Byte-identical across all nine Reference pages, which is
 * why it is one component here.
 *
 * The WhatsApp number and the social accounts come from site settings in the
 * CMS (ticket 19). An account nobody has supplied yet keeps the Reference
 * site's `#`, rather than losing its icon: the accounts are awaiting the
 * founders, and ticket 39 will not let the site go public with them empty.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const contact = await getContactPoints();

  return (
    <footer>
      <div className="wrap">
        <div className="brand foot">
          <img className="lg" src="/brand/rabaed-wordmark-on-dark.png" alt="ربائد" width={563} height={210} />
        </div>
        <div>نظام تشغيل مشاريع الإنشاء · الرياض · rabaedapp.com</div>
        <div className="social">
          <a href={contact.social.linkedin ?? '#'} aria-label="لينكدإن" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.8 8.4h3v10.8h-3zM6.3 4.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10.3 8.4h2.9v1.5c.6-1 1.7-1.7 3.2-1.7 2.6 0 3.8 1.6 3.8 4.5v6.5h-3v-5.8c0-1.5-.5-2.4-1.8-2.4-1.1 0-1.8.8-2.1 1.6-.1.3-.1.7-.1 1v5.6h-2.9z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.x ?? '#'} aria-label="إكس" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17.53 3h3.13l-6.84 7.82L22 21h-6.3l-4.93-6.44L5.13 21H2l7.31-8.36L2 3h6.46l4.46 5.89L17.53 3zm-1.1 16.14h1.74L7.66 4.77H5.8l10.63 14.37z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.facebook ?? '#'} aria-label="فيسبوك" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13.6 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.8V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.6V13h2.7v8z" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.social.instagram ?? '#'} aria-label="إنستجرام" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
            </svg>
          </a>
          <a href={contact.whatsappUrl} aria-label="واتساب" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3.6a8.3 8.3 0 0 0-7.1 12.6L3.8 20.4l4.3-1.1A8.3 8.3 0 1 0 12 3.6z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9.4 8.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .6l-.4.5c-.1.2-.2.3-.1.5.4.8 1.3 1.7 2.2 2.1.2.1.4.1.5-.1l.5-.5c.2-.2.3-.2.5-.1l1.6.8c.2.1.3.3.3.5v.5c0 .5-.4.9-.9 1-1 .2-2.5-.2-4.1-1.6s-2.2-2.9-2.4-3.9c-.1-.5.1-1 .5-1.3z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
      <div className="wrap foot-bar">
        <div className="foot-legal">
          {FOOTER_LEGAL_LINKS.map((link) => (
            <a key={link.path} href={localePath(locale, link.path)}>
              {link.label}
            </a>
          ))}
        </div>
        {/* DIVERGENCE FROM THE REFERENCE SITE, deliberate.
            The Reference site puts the whole line inside `.mono`, so the
            Arabic in it is set in DM Mono — a face with no Arabic glyphs at
            all. What a visitor sees is the browser's last-resort serif,
            monospaced and disjointed, which is precisely the failure the spec
            forbids: "DM Mono for Latin numerals only ... must never be applied
            to Arabic text". Only the year is Latin, so only the year is mono. */}
        <div>
          © <span className="mono">2026</span> ربائد · جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
