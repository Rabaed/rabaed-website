import { createHash } from 'node:crypto';

/**
 * The Pour Tracker file a visitor downloads (tickets 18 and 49), as the suites
 * that fetch it recognise it.
 */
export const POUR_TRACKER = {
  name: 'Rabaed-Pour-Tracker.html',
  path: '/downloads/Rabaed-Pour-Tracker.html',
  /** Build 2026-08-25.7, as the co-founder delivered it with its own checksum file. */
  build: '2026-08-25.7',
  sha256: 'd13f6410f71591eceb259f52e399e1db5a1847342b3dc57d089d05c46b1b7f8e',
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
