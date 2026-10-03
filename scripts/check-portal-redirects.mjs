// Checks a deployment's portal redirects. Needs Node 18+.
//
//   node scripts/check-portal-redirects.mjs https://<preview>.vercel.app
//   node scripts/check-portal-redirects.mjs https://rabaedapp.com   (after the cutover)
//
// Two kinds of case, and the second kind is the one that catches real
// mistakes. The `portal` cases are addresses the Bubble portal has already
// sent out — invite emails, submittal emails, Excel exports, the QR codes on
// printed letters, stored private files — which must leave for
// app.rabaedapp.com with their path and query intact. The `site` cases are
// addresses this site owns, which must NOT leave: a rule that forwards
// everything passes every `portal` case and takes the marketing site down
// with it.
//
// Nothing is followed. The script reads the answer the deployment gives and
// stops there, so running it against production sends no traffic to Bubble.

const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!base) {
  console.error('usage: node scripts/check-portal-redirects.mjs <base URL>');
  process.exit(2);
}

const PORTAL = 'https://app.rabaedapp.com';

const cases = [
  // --- the site's own addresses: must be served here, never forwarded ---
  ['GET', '/', 'site'],
  ['GET', '/product', 'site'],
  ['GET', '/start', 'site'],
  ['GET', '/referral', 'site'],
  ['GET', '/partnership', 'site'],
  ['GET', '/tool', 'site'],
  ['GET', '/terms', 'site'],
  ['GET', '/privacy', 'site'],
  ['GET', '/referral-terms', 'site'],
  ['GET', '/en', 'site'], // the English home page, not a Bubble address
  ['GET', '/sitemap.xml', 'site'],
  ['GET', '/robots.txt', 'site'],

  // The CMS and its API are this app's. `/api/users` answers 403 rather than
  // 200 — unauthenticated, which is correct — so it is checked for "did not
  // leave" rather than for a status.
  ['GET', '/maktab', 'stays'],
  ['GET', '/api/users', 'stays'],

  // --- the portal's addresses: must be forwarded, path and query intact ---
  ['GET', '/signin?lang=ar_ar', 'portal'], // the header's sign-in button
  ['GET', '/registration?token=abc123XYZ', 'portal'], // invite email
  ['GET', '/version-test/registration?token=abc123XYZ', 'portal'], // invite email, test version
  ['GET', '/version-live/registration?token=abc123XYZ', 'portal'],
  ['GET', '/version-live/submittal/sar-026-1790000000000x100000000000000000', 'portal'], // submittal email
  ['GET', '/submittal/1790000000000x100000000000000000', 'portal'], // Excel export
  ['GET', '/verify/AbC123tokenAbC123tokenAbC123to054', 'portal'], // printed letter QR code
  ['GET', '/version-live/verify/AbC123tokenAbC123tokenAbC123to054', 'portal'],
  ['GET', '/fileupload/f1729516897294x808916950788260100/Inspection%20Request%201.pdf', 'portal'],
  ['GET', '/project/test3?nav=2', 'portal'],
  ['GET', '/a-bubble-page-that-does-not-exist-yet', 'portal'], // a new Bubble page needs no edit here
  ['POST', '/api/1.1/wf/redeem-invite', 'portal'], // Payload owns /api/*, so this one needs its own rule
  ['GET', '/api/1.1/obj/project', 'portal'],
];

let failed = 0;

for (const [method, path, expected] of cases) {
  let res;
  try {
    res = await fetch(base + path, {
      method,
      redirect: 'manual',
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
      body: method === 'POST' ? JSON.stringify({ probe: true }) : undefined,
    });
  } catch (error) {
    console.log('FAIL', method.padEnd(4), path, '| request error:', error.message);
    failed++;
    continue;
  }

  const location = res.headers.get('location') || '';
  let ok;
  let detail;

  if (expected === 'portal') {
    const want = PORTAL + path;
    ok = (res.status === 307 || res.status === 308) && location === want;
    detail = `${res.status} -> ${location || '(no Location)'}${ok ? '' : `   expected 307/308 -> ${want}`}`;
  } else if (expected === 'stays') {
    // Any answer at all, as long as it did not go to the portal.
    ok = !location.startsWith(PORTAL);
    detail = `${res.status}${location ? ` -> ${location}` : ''}${ok ? '' : '   left for the portal'}`;
  } else {
    ok = res.status === 200;
    detail = `${res.status}${location ? ` -> ${location}` : ''}${ok ? '' : '   expected 200'}`;
  }

  console.log(ok ? 'ok  ' : 'FAIL', method.padEnd(4), path, '|', detail);
  if (!ok) failed++;
}

console.log(failed ? `\n${failed} of ${cases.length} failed` : `\nall ${cases.length} passed`);
process.exit(failed ? 1 : 0);
