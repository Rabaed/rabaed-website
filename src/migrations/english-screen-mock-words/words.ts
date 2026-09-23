/**
 * What each Screen mock shows, in English (ticket 41): the picture's
 * description for screen readers and the caption under it, as proposed to the
 * founder for his approval. Written as a draft and published by nobody but
 * him — the words are his, as ticket 40's were.
 *
 * **Frozen.** This is what the migration proposed on the day it ran, and the
 * site does not read it: it reads the CMS, where the founder may have changed
 * any of it before publishing. A word here is changed only to correct what
 * this migration wrote, never to change what the site says.
 *
 * Each is the Arabic description's meaning (`product-page-import/words.ts`,
 * `SCREEN_MOCK_DESCRIPTIONS`), held to the entry's 150 characters, and
 * describes the English export — which shows the same screen as the Arabic,
 * with its interface in English.
 */
export const ENGLISH_SCREEN_MOCK_DESCRIPTIONS = {
  correspondence:
    'Official correspondence in Rabaed: letters with reference numbers, their reply status and how long each party has waited',
  kanban:
    'Rabaed’s approvals board: draft, internal review in the contractor engineer’s and project manager’s lanes, then awaiting approval and approved',
  'daily-report':
    'A daily report in Rabaed: weather and site, the site staff and labour by headcount and hours, and the activities and photos',
  documents:
    'Rabaed’s document store: folders, and a table of files by version, type, source ID and who uploaded each',
  'stamped-sheet':
    'Rabaed’s stamped approval sheet: four signatures by role, company and time of action, approval code B, and the stamp',
  overview: 'What the owner sees in Rabaed: one project dashboard with its approval indicators and the project’s parties',
  'approvals-table':
    'What the consultant sees in Rabaed: the table of approvals and requests by status, discipline and type',
  submittal: 'What the contractor sees in Rabaed: the request’s details, and approvals naming everyone who acted and when',
} as const;
