import type { ProfileContactContent } from '@/content/pages/profile-close';
import { Glyph } from './glyph';

/** Each line's icon. */
const ICONS = { phone: 'phone.png', email: 'mail-open.png', whatsapp: 'wa.png' } as const;

/**
 * The Company profile's contact section (`#contact`, ticket 109): Ahmed's
 * footer, as the page's last section, above the site's own footer — the
 * wordmark, his tagline, his name, mobile and email, the company's WhatsApp
 * from the site settings, the location, and the site's social accounts where
 * the site settings have them. A dark section, as the page started.
 */
export function Contact({ content, brand }: { content: ProfileContactContent; brand: string }) {
  return (
    <section id="contact" className="pad pf-contact">
      <div className="wrap">
        <img className="pf-wordmark" src="/brand/rabaed-wordmark-on-dark.webp" alt={brand} width={563} height={210} loading="lazy" />
        <h2 className="pf-tagline">{content.tagline}</h2>
        <p className="pf-person">
          <Glyph file="user.png" />
          {content.name}
        </p>
        <ul className="pf-lines">
          {content.lines.map(({ kind, label, written, href }) => (
            <li key={kind}>
              <a href={href} {...(kind === 'whatsapp' ? { target: '_blank', rel: 'noopener' } : {})}>
                <Glyph file={ICONS[kind]} />
                <span className="pf-line-label">{label}</span>
                <bdi dir="ltr">{written}</bdi>
              </a>
            </li>
          ))}
        </ul>
        <p className="pf-location">
          <Glyph file="pin.png" />
          {content.location}
        </p>
        {content.social.length > 0 && (
          <ul className="pf-social">
            {content.social.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
