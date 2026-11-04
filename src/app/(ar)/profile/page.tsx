import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfilePage } from '@/components/pages/profile-page';
import { inLanguage, publishedLocales } from '@/content/pages/languages';
import { getProfilePage } from '@/content/pages/profile';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [content, locales] = await Promise.all([inLanguage('profile', 'ar', getProfilePage), publishedLocales('profile')]);
  if (!content) notFound();
  return pageMetadata({ locale: 'ar', locales, path: '/profile', ...content.meta });
}

/**
 * The Arabic Company profile: `src/components/pages/profile-page.tsx`, in
 * Arabic — and not found until the founder publishes it (ticket 102), so the
 * page can be built ticket by ticket without rabaedapp.com showing half of it.
 * An Editor previewing sees the draft. It names English among its languages
 * once its English is published.
 */
export default async function ArabicProfilePage() {
  const [content, locales] = await Promise.all([inLanguage('profile', 'ar', getProfilePage), publishedLocales('profile')]);
  if (!content) notFound();
  return <ProfilePage locale="ar" locales={locales} content={content} />;
}
