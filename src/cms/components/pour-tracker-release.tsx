'use client';
import { useState } from 'react';
import { useField, useTranslation } from '@payloadcms/ui';
import type { UIFieldClientComponent } from 'payload';
import type { UploadAnswer } from '../globals/pour-tracker';
import type { Words } from '../page-fields';
import { OLDER_THAN_LIVE, THE_CODE_COPY } from '../pour-tracker-words';

/**
 * Where Ahmed uploads a Pour Tracker release (tickets 100 and 101, ADR-0024):
 * its HTML file and its checksum file, picked together and checked together.
 *
 * "Check and upload" sends both to the entry's endpoint
 * (`src/cms/globals/pour-tracker.ts`), which keeps the file only if the two
 * match and its release number names no other file. When it is kept, the
 * entry's own fields are filled in with it, and it waits for **Publish
 * changes**, like any other edit; a release older than what visitors download
 * now is said to be, apart from the rest, before it is published. A pair that
 * is refused says why, in the admin's language, and changes nothing.
 *
 * "Remove release" empties the entry instead, so that once published,
 * visitors download the copy kept with the code.
 */

const WORDS = {
  html: { ar: 'ملف الإصدار (HTML)', en: 'Release HTML file' },
  checksum: { ar: 'ملف التحقق (‎.sha256)', en: 'Checksum file (.sha256)' },
  upload: { ar: 'تحقّق وارفع', en: 'Check and upload' },
  checking: { ar: 'جارٍ التحقق…', en: 'Checking…' },
  pickBoth: { ar: 'اختر الملفين كليهما.', en: 'Pick both files.' },
  failed: { ar: 'تعذّر الرفع. حاول مرة أخرى.', en: 'The upload failed. Try again.' },
  remove: { ar: 'إزالة الإصدار', en: 'Remove release' },
  removed: {
    ar: `أُزيل الإصدار من هذا المدخل. اضغط «نشر التغييرات» ليحمّل الزوار ${THE_CODE_COPY.ar}.`,
    en: `Release removed from this entry. Press Publish changes to send visitors ${THE_CODE_COPY.en}.`,
  },
} satisfies Record<string, Words>;

function keptMessage(kept: UploadAnswer, language: keyof Words): string {
  return language === 'en'
    ? `Release ${kept.releaseNumber} checked and kept. Press Publish changes to send it to visitors.`
    : `تم التحقق من الإصدار ${kept.releaseNumber} وحفظه. اضغط «نشر التغييرات» ليصل إلى الزوار.`;
}

/**
 * Going back to an older release is allowed — it is Ahmed's call — but said,
 * on its own and as a warning, before he publishes it (ticket 101).
 */
function olderWarning(kept: UploadAnswer, language: keyof Words): string {
  return language === 'en'
    ? `Release ${kept.releaseNumber} is ${OLDER_THAN_LIVE.en}.`
    : `الإصدار ${kept.releaseNumber} ${OLDER_THAN_LIVE.ar}.`;
}

export const PourTrackerRelease: UIFieldClientComponent = () => {
  const { i18n } = useTranslation();
  const language: keyof Words = i18n.language === 'en' ? 'en' : 'ar';
  const sha256 = useField<string>({ path: 'sha256' });
  const releaseNumber = useField<string>({ path: 'releaseNumber' });
  const size = useField<number>({ path: 'size' });
  const fileName = useField<string>({ path: 'fileName' });

  const [html, setHtml] = useState<File | null>(null);
  const [checksum, setChecksum] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string; warning?: string } | null>(null);

  async function upload() {
    if (!html || !checksum) return setResult({ ok: false, text: WORDS.pickBoth[language] });
    setBusy(true);
    setResult(null);
    try {
      const body = new FormData();
      body.append('html', html);
      body.append('checksum', checksum);
      const response = await fetch('/api/globals/pour-tracker/release', { method: 'POST', body, credentials: 'same-origin' });
      const answer = await response.json().catch(() => null);
      if (!response.ok) {
        const problem: Words | undefined = answer?.problem;
        return setResult({ ok: false, text: problem?.[language] ?? WORDS.failed[language] });
      }
      const kept = answer as UploadAnswer;
      sha256.setValue(kept.sha256);
      releaseNumber.setValue(kept.releaseNumber);
      size.setValue(kept.size);
      fileName.setValue(kept.fileName);
      setResult({
        ok: true,
        text: keptMessage(kept, language),
        warning: kept.olderThanLive ? olderWarning(kept, language) : undefined,
      });
    } catch {
      setResult({ ok: false, text: WORDS.failed[language] });
    } finally {
      setBusy(false);
    }
  }

  /** Clears the entry: once published, visitors download the copy kept with the code. */
  function remove() {
    sha256.setValue(null);
    releaseNumber.setValue(null);
    size.setValue(null);
    fileName.setValue(null);
    setResult({ ok: true, text: WORDS.removed[language] });
  }

  return (
    <div className="field-type" style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <label style={{ display: 'grid', gap: '0.25rem' }}>
        {WORDS.html[language]}
        <input type="file" accept=".html,text/html" onChange={(event) => setHtml(event.target.files?.[0] ?? null)} />
      </label>
      <label style={{ display: 'grid', gap: '0.25rem' }}>
        {WORDS.checksum[language]}
        <input type="file" accept=".sha256,text/plain" onChange={(event) => setChecksum(event.target.files?.[0] ?? null)} />
      </label>
      <div>
        <button type="button" className="btn btn--style-secondary btn--size-small" disabled={busy} onClick={upload}>
          {busy ? WORDS.checking[language] : WORDS.upload[language]}
        </button>{' '}
        {sha256.value && (
          <button type="button" className="btn btn--style-secondary btn--size-small" disabled={busy} onClick={remove}>
            {WORDS.remove[language]}
          </button>
        )}
      </div>
      {result && (
        <p role={result.ok ? 'status' : 'alert'} style={{ color: result.ok ? 'var(--theme-success-500)' : 'var(--theme-error-500)' }}>
          {result.text}
        </p>
      )}
      {result?.warning && (
        <p role="note" style={{ color: 'var(--theme-warning-500)', fontWeight: 600 }}>
          ⚠ {result.warning}
        </p>
      )}
    </div>
  );
};
