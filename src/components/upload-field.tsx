'use client';

import { useState } from 'react';
import { DOCUMENTS } from '@/forms/definition';

/**
 * A document field: a card that opens the file picker, and once a file is
 * chosen turns green and shows its name. The referral signup form's bank
 * documents and the partnership application's commercial registration.
 *
 * The Reference site's `.upl` structure, kept as the handoff asks — a label
 * wrapping the file input, an arrow, the document's name and a note, and the
 * chosen file's name — so its stylesheet applies unchanged (HANDOFF §4). Its
 * script found the label as the input's `parentNode`; here the component owns
 * both, so nothing depends on the nesting.
 *
 * **The file input is hidden from sight, not from the keyboard.** The
 * Reference site gives it `hidden`, which takes it out of the tab order: a
 * visitor without a mouse could not attach the documents the forms require,
 * and the stylesheet's own `:focus-within` outline could never show. Here it
 * stays in the page, clipped to nothing (`programmes.css`).
 *
 * A form that sends it (ticket 28) is told of each file chosen (`onFile`), and
 * tells the field when its answer is wrong and how far its upload has got. A
 * refused file is drawn in red rather than green; a missing one keeps the
 * empty card. The message is the form's to place. The progress runs along the
 * card's foot while the form is sending.
 */
export function UploadField({
  name,
  label,
  note,
  required = false,
  onFile,
  invalid = false,
  rejected = false,
  describedBy,
  progress = null,
}: {
  name: string;
  /** The document's name: the field's accessible name, and its visible one with the Reference site's star where it is required. */
  label: string;
  note: string;
  required?: boolean;
  onFile?: (file: File | null) => void;
  /** Whether the field's answer is wrong: missing, or refused. */
  invalid?: boolean;
  /** Whether the file chosen was refused, as too large or not a document. */
  rejected?: boolean;
  /** The id of the message saying what is wrong, while one is shown. */
  describedBy?: string;
  /** From 0 to 1 while the form is sending; `null` otherwise. */
  progress?: number | null;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const className = rejected ? 'upl bad' : fileName === null ? 'upl' : 'upl has';

  return (
    <label className={className}>
      <input
        type="file"
        name={name}
        accept={DOCUMENTS.accept}
        aria-label={label}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0] ?? null;
          setFileName(file?.name ?? null);
          onFile?.(file);
        }}
      />
      <span className="ic">↑</span>
      <span className="tx">
        <b>{required ? `${label} *` : label}</b>
        <small>{note}</small>
      </span>
      <span className="nm">{fileName ?? 'اختر ملفاً'}</span>
      {progress !== null && fileName !== null && (
        <span
          className="pg"
          role="progressbar"
          aria-label={`رفع ${label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <i style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      )}
    </label>
  );
}
