import type { ProfileCloseContent } from '@/content/pages/profile-close';
import type { Locale } from '@/lib/locales';
import { Contact } from './contact';
import { Impact } from './impact';
import { Plans } from './plans';
import { Start } from './start';
import { Templates } from './templates';
import { WhatsappButton } from './whatsapp-button';
import { Why } from './why';

/** The wordmark's name, for a screen reader: the brand's, not an Editor's words. */
const BRAND = { ar: 'ربائد', en: 'Rabaed' } as const satisfies Record<Locale, string>;

/**
 * The Company profile from its templates to its close (ticket 109): sections
 * 10 to 14, each with its own switch, in Ahmed's dark and light rhythm —
 * dark, light, dark, light, light — then his contact section, dark, over the
 * site's footer, and the floating WhatsApp button.
 */
export function ProfileClose({ content, locale }: { content: ProfileCloseContent; locale: Locale }) {
  return (
    <>
      {content.templates.shows && <Templates content={content.templates} />}
      {content.why.shows && <Why content={content.why} />}
      {content.impact.shows && <Impact content={content.impact} />}
      {content.plans.shows && <Plans content={content.plans} />}
      {content.start.shows && <Start content={content.start} />}
      {content.contact.shows && <Contact content={content.contact} brand={BRAND[locale]} />}
      <WhatsappButton link={content.whatsappButton} />
    </>
  );
}
