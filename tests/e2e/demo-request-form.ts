import type { Part } from './geometry';

/**
 * The inside of the demo request form, as compared against the Reference site.
 * The home and product pages place it in their closing section and the start
 * page beside its questions (`src/components/demo-request-form.tsx`), so every
 * comparison measures it the same way, from here. The selectors all begin at
 * `#demo`, so they measure the same elements from whichever region holds it.
 *
 * Three deliberate differences shape it, each left out only where it reaches
 * (ticket 11):
 *
 * - **The Reference site's fake confirmation** — a hidden «وصلنا طلبك» under
 *   the button — is not in the rebuild, so the form's small print is measured
 *   without it on both sides.
 * - **«60 يوماً» in the guarantee pill** sets only its numeral in DM Mono, as
 *   in the hero, where the Reference site sets the Arabic word in DM Mono too.
 *   A different face is a different width, so that one line's width and
 *   typeface are not compared; its height and its place in the pill are.
 * - **The submit button is disabled until ticket 27**, and drawn in the
 *   Reference site's own disabled style from its tool page — grey, with a 1px
 *   border the enabled button does not have. So the button's colours and
 *   height are not compared, and neither are the 2px that border adds below
 *   it: the small print's position here, and the height of the form and of
 *   whatever holds it, which each region leaves out itself. Everything above
 *   the button, and every width, is compared.
 *
 * Where the form itself sits is the region's to measure: add `#demo`, with its
 * height left out.
 */
export const DEMO_REQUEST_FORM_PARTS: readonly Part[] = [
  '#demo h3',
  // The line under the heading. The Reference site's hidden fake
  // confirmation is the next small, and the rebuild has none.
  '#demo > small:first-of-type',
  '#demo .guar',
  // Only the numeral in DM Mono.
  { selector: '#demo .guar b', omit: ['left', 'width', 'font'] },
  '#demo .two',
  '#demo input',
  '#demo select',
  // Disabled, in the Reference site's disabled style.
  { selector: '#demo .btn', omit: ['color', 'background', 'borderColor', 'height'] },
  // Below the button, so 2px lower.
  { selector: '#demo .fine', omit: ['top'] },
];
