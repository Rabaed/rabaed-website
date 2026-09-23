import { DEMO_REQUEST_FORM_PARTS } from './demo-request-form';
import type { Region } from './geometry';

/**
 * The closing section — «كيف نبدأ معك» and the demo request form beside it —
 * as compared against the Reference site. The home and product pages end on
 * the same section (`src/components/closing-section.tsx`), so both pages'
 * comparisons measure it the same way, from here.
 *
 * The form's three deliberate differences (ticket 11) are written in
 * `demo-request-form.ts`. The one that reaches outside the form is the
 * disabled button's border, 2px taller than the Reference site's button, which
 * makes the form, the grid and the section 2px taller too: their heights are
 * left out here.
 */
export const CLOSING_SECTION: Region = {
  name: 'the closing section',
  root: '#tail',
  // The disabled button's border makes the section 2px taller.
  omitFromRoot: ['height'],
  parts: [
    { selector: '.tail-grid', omit: ['height'] },
    '.eyebrow',
    'h2',
    '.tail-steps',
    '.tail-steps li',
    // In Thmanyah Sans Regular, where the Reference site's is bold (ADR-0018):
    // its typeface is left out, its place and size are still held.
    { selector: '.tail-steps b', omit: ['font'] },
    // The step's text, not the numeral's `.mono` inside the label (ADR-0018).
    '.tail-steps li > span',
    '.tail-more',
    { selector: '#demo', omit: ['height'] },
    ...DEMO_REQUEST_FORM_PARTS,
  ],
};
