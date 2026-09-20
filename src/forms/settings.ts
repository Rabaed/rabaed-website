/**
 * A form's settings, as Editors last published them in the CMS — or, for the
 * page while an editor is previewing, as last saved.
 *
 * A word the CMS does not have — a database the settings were never published
 * to — is the definition's own, so a form never shows an empty label.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type GlobalSlug } from 'payload';
import { formSettingsSlug, optionFieldName } from '@/cms/globals/form-settings';
import { fieldNames, fieldOptions, type FieldWording, type FormDefinition, type FormPageWording, type FormWording } from './definition';

export type FormSettings<Field extends string> = FormWording<Field> & {
  /** Where alerts go, or `null` while none is set. */
  readonly alertAddress: string | null;
};

type Saved = { readonly [key: string]: unknown };

/** The words the page shows with the form. */
export async function formPageWording<Field extends string>(definition: FormDefinition<Field>): Promise<FormPageWording<Field>> {
  const { isEnabled: previewing } = await draftMode();
  const { heading, lead, submit, finePrint, fields } = wordingFrom(definition, await saved(definition, previewing));
  return { heading, lead, submit, finePrint, fields };
}

/** Everything a submission is answered with: always what is published, never a draft. */
export async function publishedFormSettings<Field extends string>(definition: FormDefinition<Field>): Promise<FormSettings<Field>> {
  const settings = await saved(definition, false);
  const alertAddress = typeof settings.alertAddress === 'string' ? settings.alertAddress.trim() : '';
  return { ...wordingFrom(definition, settings), alertAddress: alertAddress || null };
}

async function saved(definition: FormDefinition, draft: boolean): Promise<Saved> {
  const payload = await getPayload({ config });
  const slug = formSettingsSlug(definition.id) as GlobalSlug;
  return (await payload.findGlobal({ slug, draft, depth: 0 })) as unknown as Saved;
}

/**
 * A list's options, each as the CMS has it under its own field name, or the
 * definition's own. Named from the definition's list of values, the same one
 * the CMS built its fields from, so that both name them alike.
 */
function optionsFrom(field: string, values: readonly string[], fallback: Readonly<Record<string, string>>, stored: Saved): Record<string, string> {
  return Object.fromEntries(values.map((value) => [value, text(stored[optionFieldName(field, value, values)], fallback[value])]));
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function group(value: unknown): Saved {
  return value && typeof value === 'object' ? (value as Saved) : {};
}

function wordingFrom<Field extends string>(definition: FormDefinition<Field>, settings: Saved): FormWording<Field> {
  const defaults = definition.wording;
  const fields = Object.fromEntries(
    fieldNames(definition).map((name) => {
      const own = group(group(settings.fields)[name]);
      const fallback = defaults.fields[name];
      const wording: FieldWording = {
        label: text(own.label, fallback.label),
        placeholder: text(own.placeholder, fallback.placeholder),
        message: text(own.message, fallback.message),
        options: fallback.options ? optionsFrom(name, fieldOptions(definition.fields[name]), fallback.options, group(own.options)) : undefined,
        tooLarge: fallback.tooLarge === undefined ? undefined : text(own.tooLarge, fallback.tooLarge),
        wrongType: fallback.wrongType === undefined ? undefined : text(own.wrongType, fallback.wrongType),
      };
      return [name, wording];
    }),
  ) as Record<Field, FieldWording>;

  return {
    heading: text(settings.heading, defaults.heading),
    lead: text(settings.lead, defaults.lead),
    submit: text(settings.submit, defaults.submit),
    finePrint: text(settings.finePrint, defaults.finePrint),
    fields,
    received: text(settings.received, defaults.received),
    refused: text(settings.refused, defaults.refused),
    failed: text(settings.failed, defaults.failed),
    confirmationSubject: text(settings.confirmationSubject, defaults.confirmationSubject),
    confirmationBody: text(settings.confirmationBody, defaults.confirmationBody),
  };
}
