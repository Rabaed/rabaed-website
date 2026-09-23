/**
 * A form's settings, as Editors last published them in the CMS — or, for the
 * page while an editor is previewing, as last saved.
 *
 * A word the CMS does not have — a database the settings were never published
 * to — is the definition's own, so a form never shows an empty label. That
 * holds for each language on its own: the English entry is one of its own
 * (`formSettingsSlug`), and until its English is published an English page
 * shows the English the form was written with (ticket 42) — never the Arabic.
 */
import config from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type GlobalSlug } from 'payload';
import { formSettingsSlug, optionFieldName } from '@/cms/globals/form-settings';
import { LOCALE_CODES, type Locale } from '@/lib/locales';
import { fieldNames, fieldOptions, type FieldWording, type FormDefinition, type FormPageWording, type FormWording } from './definition';

export type FormSettings<Field extends string> = {
  /** Where alerts go, or `null` while none is set. One address, whichever language a form is filled in. */
  readonly alertAddress: string | null;
  /** Every word, in each language. */
  readonly wording: Readonly<Record<Locale, FormWording<Field>>>;
};

type Saved = { readonly [key: string]: unknown };

/** The words the page shows with the form, in the page's language. */
export async function formPageWording<Field extends string>(
  definition: FormDefinition<Field>,
  locale: Locale,
): Promise<FormPageWording<Field>> {
  const { isEnabled: previewing } = await draftMode();
  const { heading, lead, submit, finePrint, fields } = wordingFrom(definition, locale, await saved(definition, locale, previewing));
  return { locale, heading, lead, submit, finePrint, fields };
}

/** Everything a submission is answered with: always what is published, never a draft. */
export async function publishedFormSettings<Field extends string>(definition: FormDefinition<Field>): Promise<FormSettings<Field>> {
  const stored = await Promise.all(LOCALE_CODES.map((locale) => saved(definition, locale, false)));
  const byLocale = new Map(LOCALE_CODES.map((locale, index) => [locale, stored[index]]));
  const arabic = byLocale.get('ar')!;
  const alertAddress = typeof arabic.alertAddress === 'string' ? arabic.alertAddress.trim() : '';
  const wording = Object.fromEntries(
    LOCALE_CODES.map((locale) => [locale, wordingFrom(definition, locale, byLocale.get(locale)!)]),
  ) as Record<Locale, FormWording<Field>>;
  return { alertAddress: alertAddress || null, wording };
}

async function saved(definition: FormDefinition, locale: Locale, draft: boolean): Promise<Saved> {
  const payload = await getPayload({ config });
  const slug = formSettingsSlug(definition.id, locale) as GlobalSlug;
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

function wordingFrom<Field extends string>(definition: FormDefinition<Field>, locale: Locale, settings: Saved): FormWording<Field> {
  const defaults = definition.wording[locale];
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
