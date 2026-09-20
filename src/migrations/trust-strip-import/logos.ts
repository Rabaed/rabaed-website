/**
 * The eight marks the Trust strip carried in code until ticket 20, in the
 * order the Reference site lists them, with the drawn height each needs to
 * look the same weight as its neighbours.
 *
 * **Frozen.** This is the strip's first published version, and the site does
 * not read it: it reads the CMS, where Ahmed has added a client since. A line
 * here changes only to correct what this migration imported.
 *
 * The files themselves stay in `public/logos/`: this migration reads them from
 * there and uploads them, and every database — the test server's, a preview's,
 * production's — is given its own copy that way.
 */
export const TRUST_STRIP_LOGOS = [
  { file: 'nawah.png', name: 'نواة للاستثمار العقاري', height: 32 },
  { file: 'staterra.png', name: 'Staterra', height: 26 },
  { file: 'alsharq.png', name: 'شركة الشرق للاستشارات الهندسية', height: 42 },
  { file: 'shaheen.png', name: 'شاهين للاستشارات الهندسية', height: 42 },
  { file: 'north-injazat.png', name: 'North Injazat', height: 42 },
  { file: 'amak.png', name: 'شركة أماك بيلد', height: 38 },
  { file: 'smart-directions.png', name: 'Smart Directions', height: 32 },
  { file: 'sika.png', name: 'Sika', height: 42 },
];

export const TRUST_STRIP_WORDS = {
  caption: { ar: 'أطراف نشطة حالياً تستخدم ربائد' },
  sectionName: { ar: 'جهات تعمل على ربائد' },
};
