'use client';

import { useState } from 'react';

/** What a document field accepts, as on the Reference site. Ticket 28 checks it again on the server. */
const DOCUMENT_TYPES = '.pdf,.png,.jpg,.jpeg';

/**
 * A document field: a card that opens the file picker, and once a file is
 * chosen turns green and shows its name.
 *
 * The Reference site's `.upl` structure, kept as the handoff asks — a label
 * wrapping the file input, an arrow, the document's name and a note, and the
 * chosen file's name — so its stylesheet applies unchanged (HANDOFF §4). Its
 * script found the label as the input's `parentNode`; here the component owns
 * both, so nothing depends on the nesting.
 *
 * **The file input is hidden from sight, not from the keyboard.** The
 * Reference site gives it `hidden`, which takes it out of the tab order: a
 * visitor without a mouse could not attach the IBAN certificate the form
 * requires, and the stylesheet's own `:focus-within` outline could never show.
 * Here it stays in the page, clipped to nothing (`programmes.css`).
 *
 * Choosing a file only shows it. Uploading, progress and rejection are ticket
 * 28's.
 */
export function UploadField({
  name,
  label,
  title,
  note,
  required = false,
}: {
  name: string;
  /** The field's accessible name. */
  label: string;
  /** The visible name, with the Reference site's star where it is required. */
  title: string;
  note: string;
  required?: boolean;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <label className={fileName === null ? 'upl' : 'upl has'}>
      <input
        type="file"
        name={name}
        accept={DOCUMENT_TYPES}
        aria-label={label}
        required={required}
        onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? null)}
      />
      <span className="ic">↑</span>
      <span className="tx">
        <b>{title}</b>
        <small>{note}</small>
      </span>
      <span className="nm">{fileName ?? 'اختر ملفاً'}</span>
    </label>
  );
}
