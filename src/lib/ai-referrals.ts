/**
 * Which AI assistant sent a visitor, if one did (ticket 34).
 *
 * The three the spec names — ChatGPT, Perplexity and Claude — are the only
 * direct evidence that the answer-first writing and the crawler rules
 * (tickets 33 and 35) are being read by the assistants they were written for.
 *
 * Two signals, because one of them is often missing. An assistant that opens
 * a link in its own browser sends a `Referer`; one that shows the link for the
 * reader to open in their own browser sends none, and instead marks the
 * address itself — `?utm_source=chatgpt.com` is ChatGPT's. Reading both counts
 * a visit that either one would have missed, and neither is invented here:
 * Vercel records the referrer and the query of every page view anyway
 * (`docs/analytics.md`), so this only names what is already arriving.
 */

/** The assistants, by the host they arrive from and the `utm_source` they mark. */
const ASSISTANTS: Readonly<Record<string, string>> = {
  'chatgpt.com': 'chatgpt',
  'perplexity.ai': 'perplexity',
  'claude.ai': 'claude',
};

/** `host` is that domain or a subdomain of it — `www.perplexity.ai` is Perplexity, `notperplexity.ai` is not. */
const isHost = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

/** The host a referrer names, or an empty string when there is no referrer or it is not an address. */
function hostOf(referrer: string): string {
  try {
    return new URL(referrer).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/**
 * The assistant that sent this visit — `chatgpt`, `perplexity` or `claude` —
 * or `null` for every other visit, which is nearly all of them.
 *
 * `referrer` is `document.referrer` and `search` the page's query string, both
 * exactly as the browser gives them.
 */
export function aiAssistantFrom(referrer: string, search: string): string | null {
  const host = hostOf(referrer);
  const source = new URLSearchParams(search).get('utm_source')?.trim().toLowerCase() ?? '';

  for (const [domain, assistant] of Object.entries(ASSISTANTS)) {
    if (isHost(host, domain) || isHost(source, domain)) return assistant;
  }
  return null;
}
