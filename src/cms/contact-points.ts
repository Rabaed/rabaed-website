/**
 * The contact points every page carries, as Ahmed last published them in the
 * admin — or as he last saved them, when an editor is previewing the site.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';

export type ContactPoints = {
  whatsappUrl: string;
  /** Each account's address, or `null` where none has been supplied. */
  social: Record<'linkedin' | 'x' | 'facebook' | 'instagram', string | null>;
};

export async function getContactPoints(): Promise<ContactPoints> {
  const { isEnabled: previewing } = await draftMode();
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: 'site-settings', draft: previewing, depth: 0 });

  return {
    whatsappUrl: `https://wa.me/${settings.whatsappNumber}`,
    social: {
      linkedin: settings.social?.linkedin || null,
      x: settings.social?.x || null,
      facebook: settings.social?.facebook || null,
      instagram: settings.social?.instagram || null,
    },
  };
}
