# Supabase for data and storage, Vercel for hosting

The Marketing site needs a database for CMS content and form submissions, and private file storage for applicant documents (IBAN certificates, commercial registrations). We use Supabase Postgres and Supabase Storage, with the site deployed on Vercel.

Supabase was the founder's stated preference and is a reasonable fit; the correction recorded here is that Supabase does not host the application — Vercel does. Vercel was chosen over Cloudflare because the CMS requires a Node runtime, which Cloudflare's edge runtime complicates.

## Consequences

- Applicant documents live in a private bucket, reachable only through short-lived signed URLs. No public bucket may ever hold them.
- Supabase is the lock-in point, not Vercel: moving hosts is straightforward, moving the database and storage is not.
- The future product app can share this Supabase project or use its own; that decision is deferred.
