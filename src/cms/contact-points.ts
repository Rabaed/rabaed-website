/**
 * The contact points every page carries, as Ahmed last published them in the
 * admin — or as he last saved them, when an editor is previewing the site.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import type { SiteSetting } from '@/payload-types';

export type ContactPoints = {
  whatsappUrl: string;
  /** Each account's address, or `null` where none has been supplied. */
  social: Record<'linkedin' | 'x' | 'facebook' | 'instagram', string | null>;
};

export async function getContactPoints(): Promise<ContactPoints> {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings', draft: previewing, depth: 0 });

  return { whatsappUrl: `https://wa.me/${settings.whatsappNumber}`, social: socialAccounts(settings) };
}

/** How to reach the company, as the company's structured data states it (ticket 32). */
export type PublishedContact = {
  email: string | null;
  phone: string | null;
  social: ContactPoints['social'];
};

/**
 * The contact points as published, and only as published — even to an editor
 * previewing a draft. Structured data is read by crawlers, never previewed, and
 * asking for draft mode here would make every page that carries it, English
 * pages with no footer included, render on each request rather than ahead of
 * time.
 */
export async function getPublishedContact(): Promise<PublishedContact> {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings', draft: false, depth: 0 });

  return { email: settings.email || null, phone: settings.phone || null, social: socialAccounts(settings) };
}

function socialAccounts(settings: SiteSetting): ContactPoints['social'] {
  return {
    linkedin: settings.social?.linkedin || null,
    x: settings.social?.x || null,
    facebook: settings.social?.facebook || null,
    instagram: settings.social?.instagram || null,
  };
}
