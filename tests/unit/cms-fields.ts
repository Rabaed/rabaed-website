/**
 * Where a word of a page's entry is held in the CMS, found by the path
 * `pairs.ts` gives it — so that the English proposed for it can be checked by
 * the field that will hold it, before anybody is asked to publish it
 * (`tests/unit/english-words.spec.ts`).
 *
 * A path names the entry's data as its import wrote it: a section's tab, a
 * field inside it, an item of a list by its place. Rows and unnamed tabs hold
 * fields without adding to the path, as they do in the data, and a list of
 * blocks takes the block its item names.
 */
import type { Block, Field, GlobalConfig } from 'payload';

type Named = Extract<Field, { name: string }>;

/** The fields a container holds, with rows, collapsibles and unnamed tabs opened out. */
function flat(fields: readonly Field[]): Field[] {
  return fields.flatMap((field): Field[] => {
    if (field.type === 'row' || field.type === 'collapsible') return flat(field.fields);
    if (field.type === 'tabs') {
      return field.tabs.flatMap((tab) =>
        'name' in tab && tab.name ? [{ type: 'group', name: tab.name, fields: tab.fields } as Field] : flat(tab.fields),
      );
    }
    return [field];
  });
}

function named(fields: readonly Field[], name: string): Named | undefined {
  return flat(fields).find((field): field is Named => 'name' in field && field.name === name);
}

/**
 * The English box of the word at `path` in `entry`, or a reason there is none.
 * `blockTypeAt` says which block an item of a list of blocks is, from the
 * Arabic data at the same place.
 */
export function englishFieldAt(
  entry: GlobalConfig,
  path: readonly (string | number)[],
  blockTypeAt: (path: readonly (string | number)[]) => string | undefined,
): Named {
  let fields: readonly Field[] = entry.fields;
  let field: Named | undefined;
  for (let index = 0; index < path.length; index += 1) {
    const step = path[index];
    if (typeof step === 'number') {
      if (field?.type === 'blocks') {
        const slug = blockTypeAt(path.slice(0, index + 1));
        const block = field.blocks.find((each: Block) => each.slug === slug);
        if (!block) throw new Error(`No block "${slug}" at ${path.slice(0, index + 1).join('.')}`);
        fields = block.fields;
      }
      continue;
    }
    field = named(fields, step);
    if (!field) throw new Error(`No field "${step}" at ${path.slice(0, index + 1).join('.')}`);
    fields = 'fields' in field && Array.isArray(field.fields) ? (field.fields as Field[]) : [];
  }
  // A list of words alone — a party's reviewers, the shared promises — holds
  // each as the one field of its item.
  const words = field?.type === 'array' ? flat(field.fields).find((each) => each.type === 'group') : field;
  const english = words?.type === 'group' ? named(words.fields, 'en') : undefined;
  if (!english) throw new Error(`${path.join('.')} is not a word in Arabic and English`);
  return english;
}
