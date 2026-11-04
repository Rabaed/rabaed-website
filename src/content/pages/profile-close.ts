import type { ContactPoints } from '@/cms/contact-points';
import { wordsIn } from '@/cms/pages';
import type { PageLink } from '@/components/page-link';
import type { Locale } from '@/lib/locales';
import type { ProfilePage } from '@/payload-types';
import type { Section } from './page-content';

/** Words and a heading, with the line above it: what every numbered section opens with. */
type Opening = { readonly eyebrow: string; readonly title: string };

export type ProfileTemplatesContent = Opening & {
  readonly lead: string;
  readonly hint: string;
  /** Each form: its code on the front, with its name; what it is for on the back. */
  readonly cards: readonly { readonly code: string; readonly name: string; readonly text: string }[];
};

export type ProfileWhyContent = Opening & {
  readonly reasons: readonly { readonly name: string; readonly text: string }[];
};

export type ProfileImpactContent = Opening & {
  readonly lead: string;
  /** Latin, «3.6×», and the word after it where there is one, «دقيقة». */
  readonly figures: readonly { readonly figure: string; readonly unit: string; readonly label: string }[];
  readonly activation: string;
  /** Where the figures come from: Rabaed's own project data (spec: Sections, in order). */
  readonly source: string;
};

export type ProfilePlansContent = Opening & {
  /** On the middle plan, which stands out. */
  readonly badge: string;
  readonly tiers: readonly { readonly kicker: string; readonly name: string; readonly features: readonly string[] }[];
};

export type ProfileStartContent = Opening & {
  readonly steps: readonly { readonly name: string; readonly text: string }[];
  readonly card: { readonly title: string; readonly line: string; readonly demo: PageLink; readonly whatsapp: PageLink };
};

export type ProfileContactContent = {
  readonly tagline: string;
  readonly name: string;
  /** Ahmed's mobile and email, and the company's WhatsApp, each with its label: what is written, and where it goes. */
  readonly lines: readonly { readonly kind: 'phone' | 'email' | 'whatsapp'; readonly label: string; readonly written: string; readonly href: string }[];
  readonly location: string;
  /** The site's social accounts, those the site settings have. */
  readonly social: readonly PageLink[];
};

export type ProfileCloseContent = {
  readonly templates: Section<ProfileTemplatesContent>;
  readonly why: Section<ProfileWhyContent>;
  readonly impact: Section<ProfileImpactContent>;
  readonly plans: Section<ProfilePlansContent>;
  readonly start: Section<ProfileStartContent>;
  readonly contact: Section<ProfileContactContent>;
  /** The button that floats over this page alone: named for screen readers, as it draws no words. */
  readonly whatsappButton: PageLink;
};

/** The accounts the contact section names, in Ahmed's order, by their own names, which are not translated. */
const SOCIAL = [
  ['linkedin', 'LinkedIn'],
  ['x', 'X'],
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
] as const satisfies readonly (readonly [keyof ContactPoints['social'], string])[];

/**
 * A WhatsApp number as a Saudi number is written: `966576767900` is
 * «+966 57 676 7900». A number of another shape keeps its figures as they are,
 * after the plus.
 */
export function writtenWhatsapp(number: string): string {
  const saudi = /^966(\d{2})(\d{3})(\d{4})$/.exec(number);
  return saudi ? `+966 ${saudi[1]} ${saudi[2]} ${saudi[3]}` : `+${number}`;
}

/** A telephone link for a number as written, «+966 59 600 6615»: its figures, after the plus. */
const telephone = (written: string) => `tel:${written.trim().startsWith('+') ? '+' : ''}${written.replace(/\D/g, '')}`;

/**
 * The Company profile's close in `locale` (ticket 109), from the profile's
 * entry: every word an Editor's, and every button's link — the WhatsApp ones,
 * left empty, being the site's one WhatsApp address, as is the company
 * WhatsApp in the contact section, from the site settings, so that changing
 * the number there changes it here.
 */
export function profileClose(locale: Locale, entry: ProfilePage, contact: ContactPoints): ProfileCloseContent {
  const words = (stored: Parameters<typeof wordsIn>[1]) => wordsIn(locale, stored);
  const link = (stored: Parameters<typeof wordsIn>[1]) => words(stored).trim();
  const { templates, why, impact, plans, start, contact: card, whatsappButton } = entry;
  const opening = (section: { eyebrow: Parameters<typeof wordsIn>[1]; title: Parameters<typeof wordsIn>[1] }) => ({
    eyebrow: words(section.eyebrow),
    title: words(section.title),
  });

  return {
    templates: {
      ...opening(templates),
      lead: words(templates.lead),
      hint: words(templates.hint),
      cards: templates.cards.map((each) => ({ code: each.code, name: words(each.name), text: words(each.text) })),
      shows: templates.shows !== false,
    },
    why: {
      ...opening(why),
      reasons: why.reasons.map((each) => ({ name: words(each.name), text: words(each.text) })),
      shows: why.shows !== false,
    },
    impact: {
      ...opening(impact),
      lead: words(impact.lead),
      figures: impact.figures.map((each) => ({ figure: each.figure, unit: words(each.unit).trim(), label: words(each.label) })),
      activation: words(impact.activation),
      source: words(impact.source),
      shows: impact.shows !== false,
    },
    plans: {
      ...opening(plans),
      badge: words(plans.badge),
      tiers: plans.tiers.map((each) => ({
        kicker: words(each.kicker),
        name: words(each.name),
        features: each.features.map((feature) => words(feature.feature)),
      })),
      shows: plans.shows !== false,
    },
    start: {
      ...opening(start),
      steps: start.steps.map((each) => ({ name: words(each.name), text: words(each.text) })),
      card: {
        title: words(start.cardTitle),
        line: words(start.cardLine),
        demo: { label: words(start.demoLabel), href: link(start.demoLink) },
        whatsapp: { label: words(start.whatsappLabel), href: link(start.whatsappLink) || contact.whatsappUrl },
      },
      shows: start.shows !== false,
    },
    contact: {
      tagline: words(card.tagline),
      name: words(card.name),
      lines: [
        { kind: 'phone', label: words(card.phoneLabel), written: card.phone, href: telephone(card.phone) },
        { kind: 'email', label: words(card.emailLabel), written: card.email, href: `mailto:${card.email.trim()}` },
        {
          kind: 'whatsapp',
          label: words(card.whatsappLabel),
          written: writtenWhatsapp(contact.whatsappNumber),
          href: contact.whatsappUrl,
        },
      ],
      location: words(card.location),
      social: SOCIAL.flatMap(([account, label]) => {
        const href = contact.social[account];
        return href ? [{ label, href }] : [];
      }),
      shows: card.shows !== false,
    },
    whatsappButton: { label: words(whatsappButton.label), href: link(whatsappButton.link) || contact.whatsappUrl },
  };
}
