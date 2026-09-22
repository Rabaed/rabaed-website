/**
 * How far behind a page may be when something has gone wrong (ticket 66,
 * ADR-0016).
 *
 * A page of this site is built ahead of time and rebuilt when a publish marks
 * it stale (`refreshSite` in `src/cms/revalidation.ts`), and at no other time.
 * That is the right way for a change to travel — it reaches the site in under
 * a second — but it means the mark is the only thing that ever rebuilds a
 * page. Anything that loses a mark leaves that page showing the words from
 * before the publish **until somebody publishes again**: ticket 64's race,
 * where a render already running writes the old words back over the new ones
 * and Next counts them as fresh; or a hook that throws, a request that never
 * lands, a region that missed the mark — failures we have not had yet and
 * cannot enumerate.
 *
 * This is the floor under all of them. A page is rebuilt at most this long
 * after it was last built, whether or not anything was published.
 *
 * **Ten minutes, and why ten.** The number answers "how far behind may a page
 * be when something has gone wrong", not "how long does publishing take" —
 * publishing is unaffected and still arrives in under a second. Ten minutes is
 * well inside the time an Editor would take to notice a page had not changed
 * and publish again, so the floor heals the failure before a person would
 * reach for it; and it costs about half the rebuilds of five minutes, which
 * buys nothing extra for a failure this rare. Longer — an hour — stops reading
 * as a backstop and starts reading as a tolerance for wrong words.
 *
 * **What it costs.** Next rebuilds when somebody asks for a page whose age has
 * run out, not on a timer, so a window in which nobody visited costs nothing.
 * At worst it is one extra render per page per window, and only for the pages
 * somebody actually asked for.
 *
 * **What it does not do.** It did not close ticket 64's window, and was never
 * meant to: it bounds how long a page caught by that race stays wrong. The
 * window itself is closed by publishing's second mark (`refreshSite`,
 * ADR-0017), which catches the race within seconds; this is still the floor
 * under every failure that loses a mark and is not that one.
 *
 * **Why the number is not imported where it is used.** Next reads
 * `export const revalidate` by static analysis, and only a literal: the
 * documented rule is that `revalidate = 600` is valid and `revalidate = 60 *
 * 10` is not (`node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`).
 * So each of the five routes writes the number out, and
 * `tests/unit/cached-page-age.spec.ts` holds every one of them to this
 * constant — and holds the build to it too, so the inheritance the two layouts
 * rely on is shown rather than assumed.
 */
export const MAX_PAGE_AGE_SECONDS = 600;
