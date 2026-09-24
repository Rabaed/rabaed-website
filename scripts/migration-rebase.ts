/**
 * The decisions `npm run cms:rebase-migrations` makes (ticket 88), apart from
 * the git and Payload commands it runs: which migrations are the branch's
 * own, and what name each one takes.
 *
 * Plain TypeScript that Node runs as it is, so that `rebase-migrations.mjs`
 * can import it and `tests/unit/migration-rebase.spec.ts` can test it.
 */

/** What becomes of the branch's own migrations. */
export type RebasePlan = {
  /** The branch's schema migrations, which are deleted and regenerated as one. */
  regenerate: string[];
  /** The name the regenerated schema migration takes, or `null` when the branch has none. */
  schema: string | null;
  /** Every migration of the branch's own whose name changes. */
  renames: { from: string; to: string }[];
};

/** A migration's name: its file name without `.ts`, as `payload_migrations` records it. */
const migrationNames = (files: string[]) =>
  files
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => file.slice(0, -'.ts'.length))
    .sort();

/** The block comment directly above `export async function <name>`, or nothing. */
function commentAbove(source: string, name: 'up' | 'down'): string {
  const match = new RegExp(`(/\\*\\*(?:(?!\\*/)[\\s\\S])*\\*/\\n)export async function ${name}\\b`).exec(source);
  return match?.[1] ?? '';
}

/**
 * The migration `payload migrate:create` wrote, as this project keeps one:
 * its types imported as types, which `verbatimModuleSyntax` requires; only
 * the `db` it uses taken from its arguments; and the comments the branch's
 * previous version had above `up` and `down`, which no generator can write.
 */
export function tidyMigration({ generated, previous }: { generated: string; previous: string | null }): string {
  return generated
    .replace(
      /^import \{ MigrateUpArgs, MigrateDownArgs, sql \} from '@payloadcms\/db-postgres'\n/,
      "import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';\n",
    )
    .replace(/\(\{ db, payload, req \}: (MigrateUpArgs|MigrateDownArgs)\)/g, '({ db }: $1)')
    .replace(/`\)\n/g, '`);\n')
    .replace(/^export async function (up|down)\b/gm, (line, name: 'up' | 'down') =>
      previous === null ? line : `${commentAbove(previous, name)}${line}`,
    );
}

/**
 * The SQL statements `up` runs, as written between `sql\`` and `\``, with
 * their spacing collapsed. Split on semicolons, which also splits the inside
 * of a `DO $$ … $$` block — the same way on both sides of a comparison.
 */
function upStatements(source: string): string[] {
  const up = source.slice(source.search(/export async function up\b/), source.search(/export async function down\b/));
  return [...up.matchAll(/sql`([\s\S]*?)`/g)]
    .flatMap((match) => match[1]!.split(';'))
    .map((statement) => statement.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * What the regenerated migration's `up` does that the branch's previous
 * versions did not, and the reverse. Nothing either way means a database that
 * ran the previous one already has what the regenerated one makes — which is
 * what makes it safe to keep the name, or to rename the row that records it.
 */
export function changedStatements({ previous, generated }: { previous: string[]; generated: string }): {
  dropped: string[];
  added: string[];
} {
  const before = previous.flatMap(upStatements);
  const after = upStatements(generated);
  return {
    dropped: before.filter((statement) => !after.includes(statement)),
    added: after.filter((statement) => !before.includes(statement)),
  };
}

/** `20260924_120000_trust_strip` → the moment and the rest, as Payload names a migration. */
const NAME = /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_(.+)$/;

function parse(name: string): { at: Date; rest: string } {
  const match = NAME.exec(name);
  if (!match) throw new Error(`${name} is not named as Payload names a migration, YYYYMMDD_HHMMSS_name.`);
  const [, year, month, day, hour, minute, second, rest] = match;
  return { at: new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`), rest: rest! };
}

/** What `payload migrate:create` is given to name a migration: its name without the moment in front. */
export const nameAfterMoment = (name: string) => parse(name).rest;

/** A moment as Payload writes it at the front of a migration's name: in UTC, to the second. */
function stamp(at: Date): string {
  const [date, time] = at.toISOString().split('T');
  return `${date!.replace(/\D/g, '')}_${time!.slice(0, 8).replace(/\D/g, '')}`;
}

/**
 * Plans the rebase from the files in `src/migrations/` — `folder` on this
 * branch, `base` on the `main` it has merged. A migration is the branch's own
 * when `main` has no file of that name, and a schema migration when it has a
 * snapshot beside it.
 *
 * **Names are kept whenever they still sort after every one of main's**,
 * because a database that has run a migration knows it by name. When one of
 * them does not, they all move after main's, keeping their order, from `now`:
 * run before main's on a database built from scratch they could meet tables
 * that are not there yet, and the newest snapshot by name — what Payload diffs
 * the next migration against — would be main's, without this branch's tables.
 * All of them, not just the ones that sort too early: moved to now, those
 * would come after the rest and run out of the order they were written in.
 */
export function planRebase({ folder, base, now }: { folder: string[]; base: string[]; now: Date }): RebasePlan {
  const mainNames = migrationNames(base);
  const main = new Set(mainNames);
  const own = migrationNames(folder).filter((name) => !main.has(name));
  const regenerate = own.filter((name) => folder.includes(`${name}.json`));

  const latest = mainNames.at(-1);
  if (own.length === 0 || latest === undefined || own[0]! > latest) {
    return { regenerate, schema: regenerate[0] ?? null, renames: [] };
  }

  // The regenerated migration holds the whole difference from main, so a
  // second schema migration folds into the first and takes no name of its own.
  const kept = own.filter((name) => !regenerate.includes(name) || name === regenerate[0]);
  const after = parse(latest).at.getTime() + 1000;
  const start = Math.max(Math.floor(now.getTime() / 1000) * 1000, after);
  const renames = kept.map((from, index) => ({
    from,
    to: `${stamp(new Date(start + index * 1000))}_${nameAfterMoment(from)}`,
  }));
  const schema = regenerate[0] === undefined ? null : renames.find((rename) => rename.from === regenerate[0])!.to;
  return { regenerate, schema, renames };
}
