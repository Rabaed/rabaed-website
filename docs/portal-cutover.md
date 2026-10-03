# Moving the product app to app.rabaedapp.com

`rabaedapp.com` is the product app today. After this it is this site, and the product app is `app.rabaedapp.com`. Links the product app gave out keep working: see [ADR-0026](adr/0026-the-product-app-is-asked-whether-it-has-the-page.md) for why the forwarding is shaped the way it is.

DNS is at GoDaddy, default TTL 600 seconds, so any step below can be undone in about ten minutes.

**Never move the domain to Vercel's nameservers.** The zone holds the MX records for Microsoft 365 and the SPF record for MailerLite. Changing nameservers moves the whole zone and takes company email with it. Only the website's A and CNAME records change, at GoDaddy, and every other record is left alone.

## The zone before the move

So that a rollback restores exactly this. Recorded on 3 October 2026:

| Name | Type | Value |
|---|---|---|
| `@` | A | `104.16.36.105`, `104.16.42.105`, `104.19.240.93`, `104.19.241.93` |
| `www` | A | the same four |
| `app` | A | the same four, added for the move |
| `@` | MX | `rabaedapp-com.mail.protection.outlook.com` |
| `@` | TXT | SPF (`include:_spf.mlsend.com include:spf.protection.outlook.com -all`), `MS=…`, Brevo, MailerLite |

There is no CAA record, so nothing stops Vercel from issuing a certificate. Screenshot the whole zone in GoDaddy before starting anyway, filters cleared, so that any CNAMEs (Microsoft 365's DKIM selectors, `autodiscover`) are on record too.

## Before (nothing goes live)

1. **Bubble → Settings → Domain & email**: type `app.rabaedapp.com` and note the record it asks for. Do not save.
2. **GoDaddy**: give `app` that record, TTL 600. It will resolve but answer with a certificate error until switch night. That is expected: **Bubble issues the certificate for its domain only once the domain field is changed**, so it cannot be done in advance.
3. **Bubble: rename the `/admin` page**, so that `/admin` answers 404. Until then the site forwards every scanner that tries `/admin` straight to the product app, and the checker's `/admin` case fails.
4. **Check the callbacks.** Anything that registered `rabaedapp.com` as an allowed address — social or SSO sign-in, a payment gateway's callback, a webhook — rejects the new address, and a redirect does not rescue it.
5. **Vercel → Settings → Domains**: add `rabaedapp.com` and `www.rabaedapp.com`. Both say "Invalid Configuration" until DNS moves, which is correct. **`rabaedapp.com` is the primary domain and `www.rabaedapp.com` redirects to it with 308** — Vercel suggests the reverse, so check which way round it is. The site's canonical addresses, sitemap and structured data all name `https://rabaedapp.com`; were it the one redirecting, every one of them would point at a redirect. Note the A record IP and the `www` CNAME target Vercel gives. Do not copy an IP from documentation: newer projects are given a different one.
6. **Tell users** the day before: the product app's address changes, there is a short outage, and **everyone signed in is signed out once.** Sessions are held in cookies bound to the hostname, so a session on `rabaedapp.com` cannot follow the product app to `app.rabaedapp.com`.

The checker cannot usefully be run on a preview: previews are behind Vercel's Deployment Protection, and until switch night every question to `app.rabaedapp.com` fails, so the site forwards even the addresses it should refuse. The check after the switch is the gate.

## Switch night

The site is down from the first step until Vercel serves it. The DNS change comes straight after Bubble's, so that Bubble's certificate and Vercel's are issued at the same time rather than one after the other. The cost: once the apex has moved, aborting takes the full rollback below rather than one change in Bubble.

1. **Bubble**: domain field → `app.rabaedapp.com`, save. ⚠️ The outage starts.
2. **GoDaddy**: edit one `@` A record to Vercel's IP, then delete the other three `@` A records.
3. **GoDaddy**: delete the four `www` A records, then add `www` as a CNAME to Vercel's target.
4. **Wait for both**, in either order:
   - **Bubble's certificate**: `https://app.rabaedapp.com/signin?lang=ar_ar` loads with no certificate warning. The product app is back.
   - **Vercel**: both domains show Valid with a certificate. The site is back. ⚠️ The outage ends.
   Until Bubble's certificate is issued, old links reach the site, are forwarded to `app.rabaedapp.com`, and show a certificate warning there.
5. **Vercel → Settings → Environment Variables**: set `SITE_INDEXABLE=true` on **Production**, and **redeploy** — only once both waits are over. The variable alone does nothing: `headers()` in `next.config.ts` and the pages are built ahead of time, so they read it only when the site is built again. The redeploy does a second job: it starts the proxy with nothing remembered, so no answer Bubble gave while half-moved outlives the move (ADR-0026 — "has not" is remembered for an hour).
6. **CMS**: in `/maktab`, open Site words and change the sign-in address to `https://app.rabaedapp.com/signin?lang=ar_ar`. Publish. Without it the sign-in button still works — it reaches the site and is forwarded — but every visitor takes a detour on the one button that matters most.
7. **Check**, after the redeploy:

   ```bash
   npm run check:redirects -- https://rabaedapp.com
   ```

   `all 31 passed`, and `curl -sI https://rabaedapp.com | grep -i x-robots` prints nothing.
8. **Sign in** from `rabaedapp.com`'s button, in a browser, all the way into the product app.

### If it goes wrong

**Before step 2**, DNS is untouched: put Bubble's domain field back to `rabaedapp.com`.

**After step 2**:

1. Bubble's domain field back to `rabaedapp.com`.
2. GoDaddy: delete the `www` CNAME.
3. GoDaddy: restore the eight A records in the table above — `@` and `www`, each with the four addresses — TTL 600.
4. Vercel: remove `SITE_INDEXABLE`, or set it to `false`, and redeploy, if it was set.
5. CMS: the sign-in address back to `https://rabaedapp.com/signin?lang=ar_ar`, if it was changed.
6. Wait ten minutes for the TTL, and confirm the product app loads at `rabaedapp.com`.

Either way, Bubble issues a certificate for `rabaedapp.com` again once its domain field changes back, so expect a certificate warning for a while, as on the way in. The forwarding is never cached, so no browser holds on to it.

## The morning after

Look through Vercel's and Bubble's logs for redirect loops and runs of 404s. In Search Console, resubmit `rabaedapp.com`'s sitemap.

## A week later

Change `FORWARD_STATUS` in `src/lib/product-app.ts` from `307` to `308` and deploy. It is the one status both the proxy and the API's route handler send with. That tells search engines the move is permanent. It is cached by browsers for good, which is why it waits until the cutover has been watched for a week.

Remove the old-cookie clean-up the same day; by then none of the product app's old login cookies can exist. They expire 72 hours after they were last renewed, which stopped on 3 October:

- **Code**: the old-cookie expiry in `forwardToProductApp` (`src/lib/product-app.ts`), and its three tests at the end of `tests/e2e/product-app-forwarding.spec.ts`.
- **CMS**: the sign-in address back to `https://app.rabaedapp.com/signin?lang=ar_ar`. Until then it goes through `https://rabaedapp.com/signin`, so that signing in from the site passes through the forward that expires the old cookies.
- **Bubble**: the hidden `fetch` to `https://rabaedapp.com/signin` on the sign-in page, which does the same for people who go straight to `app.rabaedapp.com`.

## From now on

Nothing to keep in step. For any address this site has no page for, the proxy asks the product app whether it has one, and forwards only if it does ([ADR-0026](adr/0026-the-product-app-is-asked-whether-it-has-the-page.md)). A page added to either side works without touching the other.

Two things to know:

1. **No page here may take an address the product app gave out.** Not `/signin`, `/registration`, `/verify`, `/submittal`, `/project` or `/projects_list`, nor anything starting `/version-`, `/api/1.1/` or `/fileupload/`. A page of this site's at one of them answers it, and the letters that point there have already been printed.
2. **The product app must answer 404 for a page it does not have.** That is the whole of what the proxy relies on. If Bubble is ever set to answer missing pages with a 200, every mistyped address will start leaving for the product app. The checker's `/nothing-here` case is what catches it.
