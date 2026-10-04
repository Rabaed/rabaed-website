'use client';

import { useTranslation } from '@payloadcms/ui';
import { useState } from 'react';

/**
 * The confirmation email as an applicant would get it, under the form's
 * settings (ADR-0028): drawn by the site from what was last saved — the draft
 * if there is one — with an example name in the placeholder's place.
 * Redrawn on "Refresh", since what it shows is what was saved, not what is
 * being typed.
 */
export function ConfirmationPreview({ form, locale }: { form: string; locale: string }) {
  const { i18n } = useTranslation();
  const arabic = i18n.language === 'ar';
  const [drawn, setDrawn] = useState(0);
  const address = `/api/preview/confirmation-email?form=${encodeURIComponent(form)}&locale=${encodeURIComponent(locale)}&drawn=${drawn}`;

  return (
    <div className="field-type" style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <strong>{arabic ? 'معاينة الرسالة' : 'Email preview'}</strong>
        <span style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} onClick={() => setDrawn(drawn + 1)}>
            {arabic ? 'تحديث' : 'Refresh'}
          </button>
          <a href={address} target="_blank" rel="noopener noreferrer" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }}>
            {arabic ? 'افتحها كاملة' : 'Open in full'}
          </a>
        </span>
      </div>
      <p style={{ margin: '0 0 8px', color: 'var(--theme-elevation-500)' }}>
        {arabic
          ? 'تعرض آخر ما حُفظ: احفظ المسودة، ثم «تحديث». الاسم فيها مثال.'
          : 'Shows what was last saved: save the draft, then “Refresh”. The name in it is an example.'}
      </p>
      <iframe
        key={drawn}
        src={address}
        title={arabic ? 'معاينة رسالة التأكيد' : 'Confirmation email preview'}
        sandbox=""
        style={{ width: '100%', height: 720, border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: '#F3F2EF' }}
      />
    </div>
  );
}
