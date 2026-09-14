import type { Access } from 'payload';

/**
 * Any signed-in editor. There is no public account of any kind on this site
 * (spec: Out of Scope), and every Editor can change everything, the legal
 * documents included (ADR-0007), so this is the only line access is drawn along.
 */
export const signedIn: Access = ({ req }) => Boolean(req.user);
