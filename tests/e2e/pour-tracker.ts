import { createHash } from 'node:crypto';

/**
 * The Pour Tracker file a visitor downloads (tickets 18 and 49), as the suites
 * that fetch it recognise it.
 */
export const POUR_TRACKER = {
  name: 'Rabaed-Pour-Tracker.html',
  path: '/downloads/Rabaed-Pour-Tracker.html',
  /**
   * Build 2026-09-23.3, as the co-founder delivered it with its own checksum
   * file — the copy kept with the code since it went live from the CMS on
   * 3 October 2026 and passed this walk-through (ADR-0024). Build 2026-08-25.7
   * before it.
   */
  build: '2026-09-23.3',
  sha256: '925a4ed9d38bc22f8f8c6fc44f606f3c8adbfb3f1011753c645bd4e9c4616eaf',
} as const;

/**
 * The SHA-256 of a downloaded copy, to hold against `POUR_TRACKER.sha256`.
 *
 * The file's code is deliberately unreadable — even its words and its build
 * are not written plainly in it — so its bytes are the only thing a copy can
 * be recognised by. A changed byte and the tool calls itself a modified copy.
 */
export function checksumOf(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}
