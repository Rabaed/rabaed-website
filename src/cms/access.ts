import type { Access } from 'payload';

/**
 * Any signed-in editor. There is no public account of any kind on this site
 * (spec: Out of Scope), so this is the only line access is drawn along until
 * ticket 25 restricts the legal pages to their owner (ADR-0003).
 */
export const signedIn: Access = ({ req }) => Boolean(req.user);
