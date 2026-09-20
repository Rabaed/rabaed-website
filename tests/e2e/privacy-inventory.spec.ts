/**
 * The privacy inventory (ticket 37): the plain-language list of everything the
 * site collects, in Arabic and in English, that the lawyer rewrites the
 * Privacy Policy from.
 *
 * It is prose, so nothing here judges whether it reads well. What it judges is
 * the one way prose about code goes wrong: a field is added to a form, nobody
 * remembers the inventory, and the policy the lawyer wrote from it now
 * describes a site that collects less than it does. Every field reaches
 * storage, spam protection and the Privacy Policy (`src/forms/definition.ts`),
 * so a field the inventory does not name is a field nobody told the lawyer
 * about.
 *
 * Both directions matter: a field missing from the inventory is the exposure,
 * and a field named there that no form has any more is the inventory
 * describing collection that has stopped.
 *
 * It opens no browser, as the screen mock registry's two checks do not. The
 * comparison is against `src/forms/`, which is where what the site collects is
 * actually decided.
 *
 * **The convention it reads:** inside a form's section, the only thing set in
 * `code type` within a table row is a field's own name. Anything else — a
 * stored value, a file type — is written in «guillemets».
 */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fieldNames, FORM_IDS } from '../../src/forms/definition';
import { FORMS } from '../../src/forms/registry';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

/** The two inventories, each the whole of what the site collects in one language. */
const INVENTORIES = [
  { language: 'Arabic', file: 'docs/privacy-inventory.ar.md' },
  { language: 'English', file: 'docs/privacy-inventory.md' },
] as const;

async function inventory(file: string): Promise<string> {
  return readFile(path.join(repoRoot, file), 'utf8');
}

/**
 * One section of the inventory — a heading and everything under it as far as
 * the next heading — by what that heading names in `code type`: a form's id,
 * or the store applicant documents are kept in.
 */
function section(text: string, named: string): string {
  const sections = text.split(/^#{2,6} /m).slice(1);
  const found = sections.filter((block) => block.split('\n')[0].includes(`\`${named}\``));
  expect(found, `one section headed \`${named}\``).toHaveLength(1);
  return found[0];
}

/** Every field named in `code type` in the table rows of a section. */
function fieldsNamedIn(block: string): string[] {
  const named = block
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .flatMap((row) => [...row.matchAll(/`([^`]+)`/g)].map((match) => match[1]));
  return [...new Set(named)].sort();
}

test.describe('The privacy inventory for the lawyer', () => {
  for (const { language, file } of INVENTORIES) {
    test(`the ${language} inventory lists every field of every form, and no other`, async () => {
      const text = await inventory(file);

      for (const id of FORM_IDS) {
        const definition = FORMS[id];
        expect(fieldsNamedIn(section(text, id)), `${id} in ${file}`).toEqual(fieldNames(definition).sort());
      }
    });

    test(`the ${language} inventory says where every uploaded document is kept`, async () => {
      const text = await inventory(file);

      // Named in the section about the private bucket they are kept in, not
      // only in the form that asks for them: where a document goes and who can
      // reach it is the part the lawyer has to describe (ticket 28, ADR-0004).
      const documents = section(text, 'documents');
      const uploaded = FORM_IDS.flatMap((id) =>
        fieldNames(FORMS[id]).filter((name) => FORMS[id].fields[name].kind === 'document'),
      );
      expect(uploaded.length, 'the site takes uploaded documents').toBeGreaterThan(0);

      for (const name of uploaded) {
        expect(documents, `${name} in ${file}`).toContain(`\`${name}\``);
      }
    });
  }
});
