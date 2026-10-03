import type { Payload } from 'payload';
import { visitorsDownload, type VisitorsDownload } from '../globals/pour-tracker';
import type { Words } from '../page-fields';
import { OLDER_THAN_LIVE, THE_CODE_COPY } from '../pour-tracker-words';
import { codeCopyRelease } from '../../pour-tracker/code-copy';
import { isOlderRelease } from '../../pour-tracker/release';

/**
 * The Pour Tracker screen's account of its releases (ticket 101, ADR-0024):
 * what visitors download now and when it went out, what is waiting for
 * Publish if anything is, and the copy kept with the site's code — which
 * tells Ahmed what visitors would get if his release were removed.
 *
 * A server component: it reads the CMS, the documents store and the code
 * copy's checksum file each time the admin draws it, and says what the
 * download would send — so a published release whose file has gone is shown
 * as the code copy it falls back to, not as what Ahmed published.
 */

type Language = keyof Words;
type EntryFields = { releaseNumber?: string | null; sha256?: string | null; _status?: string | null };

const HEADING: Words = { ar: 'الإصدارات', en: 'Releases' };

function when(date: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'ar-u-nu-latn', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(date));
}

const LINE = {
  live: (n: string, since: string | null, l: Language): Words => ({
    ar: `يحمّل الزوار الإصدار ${n}${since ? `، المنشور في ${when(since, l)}` : ''}.`,
    en: `Visitors download release ${n}${since ? `, published ${when(since, l)}` : ''}.`,
  }),
  none: (n: string): Words => ({
    ar: `لا يوجد إصدار منشور: يحمّل الزوار ${THE_CODE_COPY.ar}، الإصدار ${n}.`,
    en: `No release is published: visitors download ${THE_CODE_COPY.en}, release ${n}.`,
  }),
  missing: (n: string): Words => ({
    ar: `ملف الإصدار المنشور غير موجود في المخزن، فيحمّل الزوار ${THE_CODE_COPY.ar}، الإصدار ${n}. ارفع الإصدار من جديد وانشره.`,
    en: `The published release’s file is not in the store, so visitors download ${THE_CODE_COPY.en}, release ${n}. Upload the release again and publish it.`,
  }),
  waiting: (n: string, older: boolean): Words => ({
    ar: `بانتظار النشر: الإصدار ${n}${older ? ` — ${OLDER_THAN_LIVE.ar}` : ''}.`,
    en: `Waiting for Publish: release ${n}${older ? ` — ${OLDER_THAN_LIVE.en}` : ''}.`,
  }),
  removal: {
    ar: `بانتظار النشر: إزالة الإصدار، ليحمّل الزوار ${THE_CODE_COPY.ar}.`,
    en: `Waiting for Publish: removing the release, so that visitors download ${THE_CODE_COPY.en}.`,
  },
  codeCopy: (n: string): Words => ({
    ar: `المحفوظ مع الموقع: الإصدار ${n}، وهو ما يحمّله الزوار متى لم يُنشر إصدار.`,
    en: `Kept with the site’s code: release ${n}, what visitors download whenever no release is published.`,
  }),
  unreadable: {
    ar: 'تعذّرت قراءة ملف التحقق للنسخة المحفوظة مع الموقع. أبلغ المطوّر.',
    en: 'The checksum file of the copy kept with the code could not be read. Tell the developer.',
  },
} satisfies Record<string, Words | ((...args: never[]) => Words)>;

async function linesFor(payload: Payload, language: Language): Promise<Words[]> {
  let now: VisitorsDownload;
  let codeCopyNumber: string;
  try {
    now = await visitorsDownload(payload);
    codeCopyNumber = (await codeCopyRelease()).releaseNumber;
  } catch {
    return [LINE.unreadable];
  }
  const published: EntryFields = await payload.findGlobal({ slug: 'pour-tracker', draft: false, depth: 0 });
  const latest: EntryFields = await payload.findGlobal({ slug: 'pour-tracker', draft: true, depth: 0 });

  const lines: Words[] = [];
  if (now.fromCms) lines.push(LINE.live(now.releaseNumber, now.since, language));
  else lines.push(now.missing ? LINE.missing(now.releaseNumber) : LINE.none(now.releaseNumber));

  // A draft saved over what is published, naming something else: a release,
  // or nothing at all — a removal waiting to go out.
  if (latest._status === 'draft' && (latest.sha256 ?? null) !== (published.sha256 ?? null)) {
    lines.push(latest.releaseNumber ? LINE.waiting(latest.releaseNumber, isOlderRelease(latest.releaseNumber, now.releaseNumber)) : LINE.removal);
  }
  lines.push(LINE.codeCopy(codeCopyNumber));
  return lines;
}

export async function PourTrackerReleasesPanel({ payload, i18n }: { payload: Payload; i18n: { language: string } }) {
  const language: Language = i18n.language === 'en' ? 'en' : 'ar';
  const lines = await linesFor(payload, language);
  return (
    <section aria-label={HEADING[language]} className="field-type" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{HEADING[language]}</h3>
      <ul style={{ display: 'grid', gap: '0.25rem', paddingInlineStart: '1.25rem' }}>
        {lines.map((line) => (
          <li key={line.en}>{line[language]}</li>
        ))}
      </ul>
    </section>
  );
}
