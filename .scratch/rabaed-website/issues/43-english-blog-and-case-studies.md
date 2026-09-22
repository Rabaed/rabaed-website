# 43: English blog and case studies — Stage 2

**What to build:** The published articles and any case studies available in English, with the admin making it obvious what still needs translating.

**Blocked by:** 23, 40

**Status:** ready-for-agent

- [ ] Launch articles translated and published in English
- [ ] Case studies translated where any are published
- [ ] The admin shows at a glance which entries are missing a translation, so the English section cannot silently fall behind
- [ ] The blog index per locale lists only entries available in that locale
- [ ] English entries carry their own structured data and sitemap entries
- [ ] Translations are reviewed by Ahmed before publishing

## Comments

**A launch article's cover is an Arabic Screen mock (noticed in ticket 41).** `20260921_101500_import_launch_articles` uploads each article's cover from `public/screen-mocks/ar/`, which is right for the Arabic articles. An English article must not reuse that picture: its cover is the same screen from `public/screen-mocks/en/` (`screenMockImagePath('en', …)`), described in the English words `src/migrations/english-screen-mock-words/words.ts` proposes.
