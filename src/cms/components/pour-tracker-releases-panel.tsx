import type { Payload } from 'payload';
import { codeCopyRelease } from '../../pour-tracker/code-copy';
import { isOlderRelease } from '../../pour-tracker/release';
import type { Words } from '../page-fields';

/**
 * The Pour Tracker screen's account of its releases (ticket 101, ADR-0024):
 * the one visitors download and when it went out, the one waiting for
 * Publish if any, and the copy kept with the site's code — which tells Ahmed
 * what visitors would get if his release were removed.
 *
 * A server component: it reads the CMS, and the code copy's checksum file,
 * each time the admin draws it.
 */

type Shown = { releaseNumber?: string | null; sha256?: string | null };

function when(date: string, language: keyof Words): string {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'ar-u-nu-latn', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(date));
}

export async function PourTrackerReleasesPanel({ payload, i18n }: { payload: Payload; i18n: { language: string } }) {
  const language: keyof Words = i18n.language === 'en' ? 'en' : 'ar';
  const codeCopy = await codeCopyRelease();
  const published: Shown = await payload.findGlobal({ slug: 'pour-tracker', draft: false, depth: 0 });
  const latest: Shown & { _status?: string | null } = await payload.findGlobal({ slug: 'pour-tracker', draft: true, depth: 0 });
  const lastPublished = await payload.findGlobalVersions({
    slug: 'pour-tracker',
    where: { 'version._status': { equals: 'published' } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
  });
  const publishedAt = lastPublished.docs[0]?.updatedAt;

  const liveNumber = published.releaseNumber || null;
  const waiting = latest._status === 'draft' && latest.sha256 !== published.sha256 ? latest : null;
  const visitorsGet = liveNumber ?? codeCopy.releaseNumber;

  const lines: string[] = [];
  if (liveNumber) {
    lines.push(
      language === 'en'
        ? `Visitors download release ${liveNumber}${publishedAt ? `, published ${when(publishedAt, language)}` : ''}.`
        : `يحمّل الزوار الإصدار ${liveNumber}${publishedAt ? `، المنشور في ${when(publishedAt, language)}` : ''}.`,
    );
  } else {
    lines.push(
      language === 'en'
        ? `No release is published: visitors download the copy kept with the code, release ${codeCopy.releaseNumber}.`
        : `لا يوجد إصدار منشور: يحمّل الزوار النسخة المحفوظة مع الموقع، الإصدار ${codeCopy.releaseNumber}.`,
    );
  }
  if (waiting) {
    if (waiting.releaseNumber) {
      const older = isOlderRelease(waiting.releaseNumber, visitorsGet);
      lines.push(
        language === 'en'
          ? `Waiting for Publish: release ${waiting.releaseNumber}${older ? ' — older than the release visitors download now' : ''}.`
          : `بانتظار النشر: الإصدار ${waiting.releaseNumber}${older ? ' — أقدم من الإصدار الذي يحمّله الزوار الآن' : ''}.`,
      );
    } else {
      lines.push(
        language === 'en'
          ? 'Waiting for Publish: removing the release, so that visitors download the copy kept with the code.'
          : 'بانتظار النشر: إزالة الإصدار، ليحمّل الزوار النسخة المحفوظة مع الموقع.',
      );
    }
  }
  lines.push(
    language === 'en'
      ? `Kept with the site’s code: release ${codeCopy.releaseNumber}, what visitors download whenever no release is published.`
      : `المحفوظ مع الموقع: الإصدار ${codeCopy.releaseNumber}، وهو ما يحمّله الزوار متى لم يُنشر إصدار.`,
  );

  const heading = language === 'en' ? 'Releases' : 'الإصدارات';
  return (
    <section aria-label={heading} className="field-type" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{heading}</h3>
      <ul style={{ display: 'grid', gap: '0.25rem', paddingInlineStart: '1.25rem' }}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
