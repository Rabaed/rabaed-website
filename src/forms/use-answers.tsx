'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { fieldNames, isAcceptable, type Answers, type FormDefinition, type FormPageWording } from './definition';

/**
 * A form's answers in the browser, checked against its definition as they are
 * typed — the rules the server applies again (`submission.ts`).
 *
 * A field says what is wrong with it only once the visitor has been into it
 * and out again, then clears as soon as it is put right: the Reference site's
 * tool page's behaviour, which every form now shares. A field the server
 * refused says so until it is changed.
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
  /** The fields the visitor has been into and come out of: only those say what is wrong. */
  const [touched, setTouched] = useState<ReadonlySet<Field>>(new Set());
  /** The fields the server refused, until they are changed. */
  const [refused, setRefused] = useState<ReadonlySet<Field>>(new Set());
  const idPrefix = useId();

  const acceptable = (name: Field) => isAcceptable(definition.fields[name], answers[name]);

  /** A field's props, and the message shown under it. */
  const field = (name: Field) => {
    const wrong = refused.has(name) || (touched.has(name) && !acceptable(name));
    const messageId = `${idPrefix}-${name}`;
    return {
      props: {
        name,
        // Marked for assistive technology. The forms are `noValidate`, so the
        // browser's own bubbles never appear, only the Arabic messages.
        required: definition.fields[name].required,
        value: answers[name],
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          const { value } = event.target;
          setAnswers((previous) => ({ ...previous, [name]: value }));
          setRefused((previous) => (previous.has(name) ? new Set([...previous].filter((each) => each !== name)) : previous));
        },
        onBlur: () => setTouched((previous) => (previous.has(name) ? previous : new Set(previous).add(name))),
        className: wrong ? 'bad' : undefined,
        'aria-invalid': wrong || undefined,
        // Only while the message is shown: a description that is always there
        // would be read out on a field that is fine.
        'aria-describedby': wrong ? messageId : undefined,
      },
      message: (
        <small className={wrong ? 'er on' : 'er'} id={messageId}>
          {wording.fields[name].message}
        </small>
      ),
    };
  };

  return {
    acceptable,
    /** Whether every answer is acceptable. */
    complete: names.every(acceptable),
    field,
    /** Counts these fields as visited, as a submit does. */
    touch: (fields: readonly Field[]) => setTouched((previous) => new Set([...previous, ...fields])),
    /** Marks the fields the server refused. */
    refuse: (fields: readonly Field[]) => {
      setRefused(new Set(fields));
      setTouched((previous) => new Set([...previous, ...fields]));
    },
  };
}
