'use client';
import { useState } from 'react';
import { useField, useTranslation } from '@payloadcms/ui';
import type { UIFieldClientComponent } from 'payload';

/**
 * Where Ahmed uploads a Pour Tracker release (ticket 100, ADR-0024): its HTML
 * file and its checksum file, picked together and checked together.
 *
 * "Check and upload" sends both to the entry's endpoint
 * (`src/cms/globals/pour-tracker.ts`), which keeps the file only if the two
 * match. When it does, the entry's own fields are filled in with what was
 * kept, and the release waits for **Publish changes**, like any other edit. A
 * pair that is refused says why, in the admin's language, and changes nothing.
 */

type Words = { readonly ar: string; readonly en: string };
type Kept = { sha256: string; releaseNumber: string | null; size: number; fileName: string };

const WORDS = {
  html: { ar: 'ملف الإصدار (HTML)', en: 'Release HTML file' },
  checksum: { ar: 'ملف التحقق (‎.sha256)', en: 'Checksum file (.sha256)' },
  upload: { ar: 'تحقّق وارفع', en: 'Check and upload' },
  checking: { ar: 'جارٍ التحقق…', en: 'Checking…' },
  pickBoth: { ar: 'اختر الملفين كليهما.', en: 'Pick both files.' },
  failed: { ar: 'تعذّر الرفع. حاول مرة أخرى.', en: 'The upload failed. Try again.' },
} satisfies Record<string, Words>;

function keptMessage(kept: Kept, language: 'ar' | 'en'): string {
  const number = kept.releaseNumber ?? '';
  return language === 'ar'
    ? `تم التحقق من الإصدار ${number} وحفظه. اضغط «نشر التغييرات» ليصل إلى الزوار.`
    : `Release ${number} checked and kept. Press Publish changes to send it to visitors.`;
}

export const PourTrackerRelease: UIFieldClientComponent = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'ar' ? 'ar' : 'en';
  const sha256 = useField<string>({ path: 'sha256' });
  const releaseNumber = useField<string>({ path: 'releaseNumber' });
  const size = useField<number>({ path: 'size' });
  const fileName = useField<string>({ path: 'fileName' });

  const [html, setHtml] = useState<File | null>(null);
  const [checksum, setChecksum] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

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
      const kept = answer as Kept;
      sha256.setValue(kept.sha256);
      releaseNumber.setValue(kept.releaseNumber ?? '');
      size.setValue(kept.size);
      fileName.setValue(kept.fileName);
      setResult({ ok: true, text: keptMessage(kept, language) });
    } catch {
      setResult({ ok: false, text: WORDS.failed[language] });
    } finally {
      setBusy(false);
    }
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
        </button>
      </div>
      {result && (
        <p role={result.ok ? 'status' : 'alert'} style={{ color: result.ok ? 'var(--theme-success-500)' : 'var(--theme-error-500)' }}>
          {result.text}
        </p>
      )}
    </div>
  );
};
