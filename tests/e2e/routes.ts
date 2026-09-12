/**
 * Every route the site serves, with a phrase from each that must survive the
 * trip to the browser. Later tickets add pages here; the suites that iterate
 * over this list then cover them without being edited.
 *
 * The phrases are real page copy, not test fixtures, because the thing being
 * proved is that *this* content reaches a client with no JavaScript.
 *
 * `locale` and `dir` are restated here rather than imported from
 * `src/lib/locales.ts` on purpose: a test that reads its expectation out of
 * the code it is testing agrees with that code by construction, and would keep
 * agreeing after somebody swapped the two directions over.
 */
export const ROUTES = [
  {
    path: '/',
    locale: 'ar',
    dir: 'rtl',
    text: ['ثلاثة أطراف', 'المالك والاستشاري والمقاول'],
  },
  {
    path: '/en',
    locale: 'en',
    dir: 'ltr',
    text: ['Rabaed', 'The English site is on its way'],
  },
] as const;
