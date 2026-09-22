/**
 * The automated accessibility check (ticket 36), shared by the suite that runs
 * it on every page as it arrives and by the suites that open a state it never
 * sees — a section scrolled light, a stamp come on.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/**
 * The standard the ticket names. `wcag21aa` carries the contrast rule;
 * `best-practice` is deliberately left out, so that what fails here is a
 * standard somebody can be held to rather than axe's own house style.
 */
const STANDARD = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * The one combination the founder kept as it is (ADR-0011): white lettering on
 * the brand accent, which is what the primary button — and the chips that share
 * its treatment — are made of. It reaches 3.25:1 where AA asks 4.5:1, and the
 * only ways to close that are to darken the brand orange on every page or to
 * set every button label at 18.66px bold. The accent as *text* was darkened
 * instead, and this pair was left.
 *
 * Listed as a pair rather than by turning the rule off, so that any other
 * colour that falls short — a new one, or one of these on a different ground —
 * still fails here.
 */
const ACCEPTED = [{ foreground: '#ffffff', background: '#f95738' }];

/**
 * The reasons axe gives for not being able to judge contrast that are the
 * question not applying rather than an answer it is withholding. Each was
 * looked at once, on this site, and each is the same handful of elements:
 *
 *  - **Only non-text characters.** The arrows on the "read more" links and in
 *    the Partnerships trigger, the `+` and `–` on a question, the bullets in a
 *    list. They are drawing, and they say nothing a reader has to read.
 *  - **Overlapped by another element.** The before/after slider's two arrows,
 *    which sit over the picture they move across, and a card's number under
 *    its own overlay.
 *  - **A background gradient.** The hero's glow, a faint wash of the accent
 *    over the dark ground, under text that is already held to that ground.
 */
const UNDECIDABLE = [
  'Element content contains only non-text characters',
  'background color could not be determined because it is overlapped by another element',
  'background color could not be determined due to a background gradient',
];

/** Whether every reason axe gave for one element is one of those. */
function undecidable(failureSummary: string | undefined): boolean {
  return UNDECIDABLE.some((why) => failureSummary?.includes(why) ?? false);
}

/**
 * Whether axe's account of one element names an accepted pair. It is the whole
 * account that is forgiven, because axe writes one pair per element for this
 * rule: a second shortfall on the same element would be a second element in
 * the report, not a second line here.
 */
function accepted(failureSummary: string | undefined): boolean {
  return ACCEPTED.some(
    (pair) =>
      failureSummary?.includes(`foreground color: ${pair.foreground}, background color: ${pair.background}`) ?? false,
  );
}

/** The rule, the elements and the fix, rather than a count. */
function describeChecks(violations: { id: string; impact?: string | null; help: string; nodes: { target: unknown[]; failureSummary?: string }[] }[]): string {
  return violations
    .map((violation) => {
      const where = violation.nodes.map(
        (node) => `      ${node.target.join(' ')}\n        ${node.failureSummary?.replace(/\n/g, '\n        ')}`,
      );
      return `  ${violation.id} (${violation.impact}): ${violation.help}\n${where.join('\n')}`;
    })
    .join('\n');
}

/**
 * What axe finds on the page as it stands, or on `include` alone: everything
 * short of the standard that is not the accepted pair, and everything it could
 * not decide for a reason other than the question not applying. Each is empty
 * when there is nothing, and otherwise says which elements and why.
 */
export async function axeFindings(page: Page, include?: string) {
  const builder = new AxeBuilder({ page }).withTags(STANDARD);
  if (include) builder.include(include);
  const { violations, incomplete } = await builder.analyze();

  const unaccepted = violations
    .map((violation) => ({ ...violation, nodes: violation.nodes.filter((node) => !accepted(node.failureSummary)) }))
    .filter((violation) => violation.nodes.length > 0);

  // What axe could not decide, which it keeps in a bucket of its own. Read
  // rather than dropped: contrast it cannot compute lands here rather than
  // above, and a page that quietly filled up with it would look as clean as
  // one with nothing wrong. Only the reasons in `UNDECIDABLE` are let through,
  // each of them axe saying the question does not apply, so a new kind of
  // undecidable arrives as a failure rather than as silence.
  const undecided = incomplete
    .map((check) => ({ ...check, nodes: check.nodes.filter((node) => !undecidable(node.failureSummary)) }))
    .filter((check) => check.nodes.length > 0);

  return { violations: describeChecks(unaccepted), undecided: describeChecks(undecided) };
}
