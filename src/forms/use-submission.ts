'use client';

import { useRef, useState } from 'react';
import { NOT_SENT, TOKEN_FIELD, type DocumentProblem, type FormDefinition, type SubmissionOutcome } from './definition';
import { sendForm } from './send';

/**
 * Sending a form, in the browser: what the server last said, how much of the
 * submission is on its way while it goes, and `send`.
 *
 * One submission is sent at a time: a second press while one is on its way
 * does nothing. Every attempt carries the same one-off token, made up on the
 * first, so a submission that arrives twice is stored once (`TOKEN_FIELD`).
 */
export function useSubmission<Field extends string>(
  definition: FormDefinition<Field>,
  onInvalid: (fields: readonly Field[], problems: Partial<Record<Field, DocumentProblem>>) => void,
) {
  const [outcome, setOutcome] = useState<SubmissionOutcome>(NOT_SENT);
  /** From 0 to 1 while a request is on its way; `null` otherwise. */
  const [progress, setProgress] = useState<number | null>(null);
  const token = useRef<string | null>(null);
  const sending = useRef(false);

  const send = async (form: HTMLFormElement) => {
    if (sending.current) return;
    sending.current = true;
    setProgress(0);

    const data = new FormData(form);
    token.current ??= crypto.randomUUID();
    data.set(TOKEN_FIELD, token.current);
    const result = await sendForm(definition.id, data, setProgress, definition.wording.failed);

    sending.current = false;
    setProgress(null);
    if (result.outcome === 'invalid') {
      onInvalid(result.fields as Field[], (result.problems ?? {}) as Partial<Record<Field, DocumentProblem>>);
    }
    setOutcome(result);
  };

  return { outcome, progress, sending: progress !== null, send };
}
