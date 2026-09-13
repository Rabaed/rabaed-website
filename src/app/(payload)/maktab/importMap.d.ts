// `importMap.js` beside this file is written by `npm run cms:generate`, and
// the project does not type-check JavaScript. This gives it the type Payload
// expects, and survives regeneration because only the `.js` is rewritten.
import type { ImportMap } from 'payload';

export declare const importMap: ImportMap;
