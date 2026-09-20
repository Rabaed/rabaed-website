'use client';

import { useId, useState, type ChangeEvent } from 'react';
import {
  CONSENT_GIVEN,
  documentProblem,
  fieldNames,
  isAcceptable,
  isRequired,
  type Answers,
  type DocumentProblem,
  type FormDefinition,
  type FormPageWording,
} from './definition';

/**
 * A form's answers in the browser, checked against its definition as they are
 * given — the rules the server applies again (`submission.ts`).
 *
 * A field says what is wrong with it only once the visitor has been into it
 * and out again, then clears as soon as it is put right: the Reference site's
 * tool page's behaviour, which every form now shares. A document says so as
 * soon as it is chosen — or taken away — and a consent as soon as it is left
 * unticked. A field the server refused says so until it is changed.
 */
export function useAnswers<Field extends string>(
  definition: FormDefinition<Field>,
  wording: FormPageWording<Field>,
  initial: Partial<Answers<Field>> = {},
) {
  const names = fieldNames(definition);
  const [answers, setAnswers] = useState<Answers<Field>>(
    () => Object.fromEntries(names.map((name) => [name, initial[name] ?? ''])) as Answers<Field>,
  );
  /** What is wrong with each chosen document: by its name and size here, by its contents on the server. */
  const [problems, setProblems] = useState<Partial<Record<Field, DocumentProblem>>>({});
  /** The fields the visitor has been into and come out of: only those say what is wrong. */
  const [touched, setTouched] = useState<ReadonlySet<Field>>(new Set());
  /** The fields the server refused, until they are changed. */
  const [refused, setRefused] = useState<ReadonlySet<Field>>(new Set());
  const idPrefix = useId();

  const acceptable = (name: Field) => isAcceptable(definition.fields[name], answers[name]) && !problems[name];
  const wrong = (name: Field) => refused.has(name) || (touched.has(name) && !acceptable(name));
  const messageId = (name: Field) => `${idPrefix}-${name}`;

  const answer = (name: Field, value: string) => {
    setAnswers((previous) => ({ ...previous, [name]: value }));
    setRefused((previous) => (previous.has(name) ? new Set([...previous].filter((each) => each !== name)) : previous));
  };
  const visit = (name: Field) => setTouched((previous) => (previous.has(name) ? previous : new Set(previous).add(name)));

  /** The message under a field: for a document, what is wrong with the file if anything is. */
  const message = (name: Field) => {
    const problem = problems[name];
    const words = wording.fields[name];
    return (
      <small className={wrong(name) ? 'er on' : 'er'} id={messageId(name)}>
        {(problem && words[problem]) || words.message}
      </small>
    );
  };

  /** Only while the message is shown: a description that is always there would be read out on a field that is fine. */
  const describedBy = (name: Field) => (wrong(name) ? messageId(name) : undefined);

  /** A typed or chosen field's props, and the message shown under it: an input, a select or a textarea. */
  const field = (name: Field) => ({
    props: {
      name,
      // Marked for assistive technology. The forms are `noValidate`, so the
      // browser's own bubbles never appear, only the Arabic messages.
      required: isRequired(definition.fields[name]),
      value: answers[name],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => answer(name, event.target.value),
      onBlur: () => visit(name),
      className: wrong(name) ? 'bad' : undefined,
      'aria-invalid': wrong(name) || undefined,
      'aria-describedby': describedBy(name),
    },
    message: message(name),
  });

  /** A consent's checkbox props, what describes it while it is wrong, and its message. */
  const consent = (name: Field) => ({
    props: {
      type: 'checkbox' as const,
      name,
      required: true,
      checked: answers[name] === CONSENT_GIVEN,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        answer(name, event.target.checked ? CONSENT_GIVEN : '');
        visit(name);
      },
      onBlur: () => visit(name),
      'aria-invalid': wrong(name) || undefined,
    },
    describedBy: describedBy(name),
    message: message(name),
  });

  /**
   * What a document field needs to report its file, show what is wrong with
   * it, and its message. A missing document is wrong, and says so under its
   * row; only a file that was refused is `rejected`, and drawn in red — an
   * empty card keeps the Reference site's look.
   */
  const upload = (name: Field) => ({
    required: isRequired(definition.fields[name]),
    invalid: wrong(name),
    rejected: Boolean(problems[name]) || refused.has(name),
    describedBy: describedBy(name),
    onFile: (file: File | null) => {
      answer(name, file?.name ?? '');
      setProblems((previous) => ({ ...previous, [name]: file ? (documentProblem(file) ?? undefined) : undefined }));
      visit(name);
    },
    message: message(name),
  });

  return {
    acceptable,
    /** Whether every answer is acceptable. */
    complete: names.every(acceptable),
    field,
    consent,
    upload,
    /** Counts these fields as visited, as a submit does. */
    touch: (fields: readonly Field[]) => setTouched((previous) => new Set([...previous, ...fields])),
    /** Marks the fields the server refused, and what it found wrong with any document among them. */
    refuse: (fields: readonly Field[], found: Partial<Record<Field, DocumentProblem>> = {}) => {
      setProblems((previous) => ({ ...previous, ...found }));
      setRefused(new Set(fields));
      setTouched((previous) => new Set([...previous, ...fields]));
    },
  };
}
