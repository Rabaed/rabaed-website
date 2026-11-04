import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { DELAY_CALCULATOR_SEED } from './delay-calculator-import/seed';

/**
 * Publishes the Delay-cost calculator's words as its first version (ticket
 * 103, ADR-0029): Ahmed's, in Arabic and English, in place of the home page's
 * calculator words, which `20261104_020004_delay_calculator` took out of the
 * home page's entry. From here on they are changed in the CMS.
 *
 * The statements are in `delay-calculator-import/seed.ts`, and the words in
 * `delay-calculator-import/words.ts`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(DELAY_CALCULATOR_SEED));
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "_delay_calculator_v";
    DELETE FROM "delay_calculator";
  `);
}
