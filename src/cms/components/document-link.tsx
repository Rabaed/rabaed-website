'use client';

import { useField, useTranslation } from '@payloadcms/ui';
import type { TextFieldClientComponent } from 'payload';

/**
 * A document's signed link, in a submission record, as a link an editor can
 * open (`src/cms/collections/form-submissions.ts`). It opens in a new tab, so
 * the record stays where it was.
 */
export const DocumentLink: TextFieldClientComponent = ({ path }) => {
  const { value } = useField<string>({ path });
  const { i18n } = useTranslation();
  if (!value) return null;

  return (
    <div className="field-type" style={{ display: 'flex', alignItems: 'flex-end' }}>
      <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn--style-secondary btn--size-small">
        {i18n.language === 'ar' ? 'افتح المستند' : 'Open document'}
      </a>
    </div>
  );
};
