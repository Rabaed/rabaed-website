# 21: All page text in the CMS

**What to build:** Ahmed edits any headline, paragraph, label or image on any of the six marketing pages and publishes the change himself.

**Blocked by:** 19, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16

**Status:** ready-for-agent

- [ ] Every page's copy is stored as localised content, not hardcoded in the markup
- [ ] Images on every page are replaceable from the admin
- [ ] Referral Program amounts live in one place and drive both the Referral page and its terms — the two can never disagree
- [ ] Structure is fixed and content is editable: Ahmed changes words and pictures, not section order
- [ ] Pages still match baselines at all eight widths after the content move
- [ ] Page text remains present in the server response with JavaScript disabled
- [ ] An entry with no translation in the requested locale is never silently substituted

**Note:** this is the widest ticket in the set. Migrate page by page, keeping the baselines green between each.
