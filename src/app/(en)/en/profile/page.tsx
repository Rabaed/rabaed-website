import type { Metadata } from 'next';
import { ArabicOnlyNotice, arabicOnlyMetadata } from '@/components/arabic-only-notice';
import { ProfilePage } from '@/components/pages/profile-page';
import { NOT_YET_IN_ENGLISH } from '@/content/arabic-only-pages';
import { inEnglish } from '@/content/pages/languages';
import { getProfilePage } from '@/content/pages/profile';
import { LOCALE_CODES } from '@/lib/locales';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const content = await inEnglish('profile', getProfilePage);
  if (!content) return arabicOnlyMetadata(NOT_YET_IN_ENGLISH.profile);
  return pageMetadata({ locale: 'en', path: '/profile', ...content.meta });
}

/**
 * The English Company profile (ticket 102): the page itself once its English
 * is published, and until then a notice that offers the Arabic
 * (`src/content/arabic-only-pages.ts`) — never the Arabic words in its place.
 * Ahmed's English is written and waiting, unpublished, in its entry.
 */
export default async function EnglishProfilePage() {
  const content = await inEnglish('profile', getProfilePage);
  if (!content) return <ArabicOnlyNotice page={NOT_YET_IN_ENGLISH.profile} />;
  return <ProfilePage locale="en" locales={LOCALE_CODES} content={content} />;
}
