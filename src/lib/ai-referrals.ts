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
 *
 * A mark on an address is whatever put it there, and so is a referrer, so what
 * this counts is a signal rather than an audit: anyone who wants to can open
 * the site with `?utm_source=claude.ai` on the end. What the number is read
 * for — whether writing for assistants is worth more of the same — survives
 * that.
 */

/** The three, under the names this counts them by. */
export type AiAssistant = 'chatgpt' | 'perplexity' | 'claude';

/**
 * Each one's host, which its own visits arrive from. A mark on the address is
 * matched against the host and against the name above it, because an assistant
 * has used either — ChatGPT marks `chatgpt.com` — and which it uses is not
 * ours to decide.
 */
const HOSTS: Readonly<Record<AiAssistant, string>> = {
  chatgpt: 'chatgpt.com',
  perplexity: 'perplexity.ai',
  claude: 'claude.ai',
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
 * The assistant that sent this visit, or `null` for every other visit, which
 * is nearly all of them.
 *
 * `referrer` is `document.referrer` and `search` the page's query string, both
 * exactly as the browser gives them.
 */
export function aiAssistantFrom(referrer: string, search: string): AiAssistant | null {
  const host = hostOf(referrer);
  const marked = new URLSearchParams(search).get('utm_source')?.trim().toLowerCase() ?? '';

  for (const [assistant, domain] of Object.entries(HOSTS) as [AiAssistant, string][]) {
    if (isHost(host, domain) || marked === domain || marked === assistant) return assistant;
  }
  return null;
}
