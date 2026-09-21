import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { ANSWER_FIRST_PROPOSAL_SEED, ANSWER_FIRST_PROPOSAL_UNSEED } from './answer-first-proposal/seed';

/**
 * Puts the answer-first copy pass in front of the founder, as drafts (ticket
 * 35).
 *
 * `reference/HANDOFF.md` §6.4 asks that the first paragraph under each major
 * heading be a standalone answer an engine can lift, names the four sections
 * that most need one, and says whose the words are: «راجعه مع أحمد، النصّ
 * نصّه». §6.5 adds the one kind of question the site never asks — Rabaed
 * against WhatsApp, email and the spreadsheet — and calls it the weakest and
 * the most asked for.
 *
 * So this writes, and publishes nothing:
 *
 * - **the four section openers**, as a draft of the home page's entry and a
 *   draft of the product page's;
 * - **all 31 answers**, rewritten to stand alone without their question, each
 *   as a draft of its own question;
 * - **four comparison questions**, as new entries in draft.
 *
 * A visitor reads none of it. Every page goes on showing its published words,
 * every question its published answer, and the four new questions appear on no
 * page at all, until the founder opens each one, reads it and presses Publish —
 * which is the approval the ticket asks for, made a gate rather than a note.
 * `docs/deployment.md` has what he does, in plain language, under «The
 * answer-first copy pass, waiting for a decision».
 *
 * The statements are in `answer-first-proposal/seed.ts`, and the words they
 * write in `answer-first-proposal/words.ts`. The seed says why it is written
 * out rather than produced by `npm run cms:freeze-seed`, and how it keeps the
 * rule that tool exists for.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(ANSWER_FIRST_PROPOSAL_SEED));
}

/**
 * Takes the proposal back: the drafts this wrote go, and what is published
 * stays exactly as it was — which is everything a visitor has ever seen of it.
 *
 * It deletes what it wrote and nothing else, naming the words of each piece.
 * A draft the founder has written since is not one of them, and a question he
 * has published is left where it is: rolling a migration back is a developer's
 * act on a schema, and it is not for it to throw away anybody's words.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(ANSWER_FIRST_PROPOSAL_UNSEED));
}
