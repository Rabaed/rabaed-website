/**
 * Run in a process of its own by `cms-boots-without-jsdom.spec.ts`, never by
 * Playwright — it is not a `.spec.ts`, so the suite does not collect it.
 *
 * It imports whatever `MODULE_UNDER_TEST` names, relative to the repository
 * root, and prints on its last line whether jsdom was loaded along with it.
 *
 * Reading the module cache is what makes this cheap and what makes it honest:
 * jsdom is CommonJS, so however it is reached — imported statically, imported
 * late, required by something else — it lands there. The spec's second test
 * proves the reading works rather than taking it on trust.
 */
import Module from 'node:module';

const name = process.env.MODULE_UNDER_TEST;
if (!name) throw new Error('MODULE_UNDER_TEST names the module to load.');

await import(name);

const cache = (Module as unknown as { _cache?: Record<string, unknown> })._cache ?? {};
const separator = String.fromCharCode(92);
const loaded = Object.keys(cache).some((file) => file.split(separator).join('/').includes('/node_modules/jsdom/'));

console.log(loaded ? 'jsdom' : 'no-jsdom');
