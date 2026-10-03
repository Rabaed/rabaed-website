# Moving the portal to app.rabaedapp.com

`rabaedapp.com` is the Bubble portal today. After this it is this site, and the portal is `app.rabaedapp.com`. Old portal links keep working: see [ADR-0025](adr/0025-the-site-forwards-every-address-it-does-not-serve-to-the-portal.md) for why the forwarding is shaped the way it is.

DNS is at GoDaddy, default TTL 600 seconds, so any step below can be undone in about ten minutes.

**Never move the domain to Vercel's nameservers.** The zone holds the MX records for Microsoft 365 and the SPF record for MailerLite. Changing nameservers moves the whole zone and takes company email with it. Only the website's A and CNAME records change, at GoDaddy, and every other record is left alone.

## Days before

1. **Add `app.rabaedapp.com` at GoDaddy**, pointing at Bubble per Bubble's own instructions, and let Bubble finish issuing its certificate. Doing this early is the whole point of the step: if it is left until switch night, there is a window where the portal's new address serves a certificate warning.
2. **Check the callbacks.** Anything that registered `rabaedapp.com` as an allowed address fails closed, and a redirect does not rescue it. Social or SSO sign-in redirect URIs, payment gateway callbacks, and any webhook sender that cannot be edited later.
3. **Deploy this branch to a preview** and run the checker against the preview URL:

   ```bash
   npm run check:redirects -- https://<preview>.vercel.app
   ```

   The last line must read `all 27 passed`. A preview is not indexable and `rabaedapp.com` still points at Bubble, so nothing is live yet.

## Switch night

Pick a quiet evening and tell users the day before: **everyone signed in is signed out once.** Sessions are held in cookies bound to the hostname, so a session on `rabaedapp.com` cannot follow the portal to `app.rabaedapp.com`. There is no way around it.

In this order:

1. **Bubble**: change the app's custom domain to `app.rabaedapp.com`.
2. **Vercel → Settings → Domains**: add `rabaedapp.com`, then add `www.rabaedapp.com` set to redirect to it with status **308**. `www` resolves to nothing today, so this is new, not a change.
3. **GoDaddy**: point the apex `A` record at the IP shown on Vercel's domain card. Do not copy an IP from documentation — newer projects are given a different one. Change nothing else in the zone.
4. **Vercel → Settings → Environment Variables**: set `SITE_INDEXABLE=true` on the **production** environment and redeploy. Until this is done every page tells search engines not to index it, which is correct for a preview and fatal for the live domain.
5. **CMS**: in `/maktab`, open Site words and change the sign-in address to `https://app.rabaedapp.com/signin?lang=ar_ar`. Publish. Without this the sign-in button still works — it goes to the apex and is forwarded — but it costs every visitor an extra hop on the one button that matters most.
6. **Check**:

   ```bash
   npm run check:redirects -- https://rabaedapp.com
   ```

   `all 27 passed`, and `curl -sI https://rabaedapp.com | grep -i x-robots` returns nothing.

### If it goes wrong

Put the apex `A` record back to its old value at GoDaddy and change Bubble's custom domain back to `rabaedapp.com`. Ten minutes. The 307 is deliberately not cached, so no browser holds onto the forwarding.

## A week later

Change `STATUS` in `src/app/(portal)/portal-redirect/[[...path]]/route.ts` from `307` to `308` and deploy. That tells search engines the move is permanent. It is cached by browsers for good, which is why it waits until the cutover has been watched for a week.

## From now on

Two rules, both enforced by nothing but this document and the checker:

1. **No page may take a portal address.** Not `/signin`, `/registration`, `/verify`, `/submittal`, `/project` or `/projects_list`, and nothing starting `/version-`, `/api/` or `/fileupload/`. Those addresses are in letters that have already been printed.
2. **No catch-all page at the top level.** It would match everything and the forwarding would never run. Under a prefix is fine, which is where `/blog/[slug]`, `/case-studies/[slug]` and `/en/[page]` already are.
