# 19: CMS foundation

**What to build:** Ahmed logs into an admin area on Rabaed's own domain, changes the contact details and social links, and sees them change on the live site.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Payload CMS mounted inside the same Next.js application, at a non-obvious admin path
- [ ] Content stored in Supabase Postgres; media in Supabase Storage (ADR-0004)
- [ ] Access is invitation-only; no public sign-up
- [ ] Admin interface available in Arabic
- [ ] Site settings global: contact details, WhatsApp number, social links — driving the footer and contact points on every page
- [ ] Uploaded images are converted to modern formats and multiple sizes automatically
- [ ] Draft and publish states work, with preview before publishing
- [ ] An edit made in the admin appears on the page; an unpublished draft does not
