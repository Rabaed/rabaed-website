/**
 * The cards on the home page's second deck: what changes for a project once
 * Rabaed is running on it.
 *
 * **Four of the six state figures nobody has sourced yet — ticket 47.** 3.6×
 * faster approvals, 7× faster document retrieval, 31% less administrative time
 * and 22% better document governance. The spec is explicit, twice: "No invented
 * figures, percentages or testimonials. Statistics appear only when supplied
 * and attributable."
 *
 * So every figure carries a `source`, and the four without one are `null`.
 * `Figures` leaves any card whose source is `null` off every public deployment
 * — preview and production alike, indexable or not (`isPubliclyDeployed`) —
 * while local builds and the test suite still draw all six, so the deck can be
 * tested and held to the Reference site. Recording a source against a figure
 * is what puts it on the site; nothing else does.
 *
 * The last two cards are not statistics but service commitments — the same
 * "under a day" and "15 minutes" the closing section already promises — so
 * they carry no source and are always shown.
 *
 * Verbatim from `reference/site/index.html`. Ticket 21 moves page copy into the
 * CMS.
 */

/** The drawing in the corner of each card. */
export type ProofIcon = 'approval' | 'retrieval' | 'time' | 'governance' | 'activation' | 'onboarding';

/** One bar of a before-and-after, drawn to scale out of 70px. */
type Bar = { readonly label: string; readonly height: number };

/** Everything a figure's card shows around the figure itself. */
type FigureFrame = {
  /** The pill at the top of the card. */
  readonly topic: string;
  readonly icon: ProofIcon;
  /** What changes, in a sentence. */
  readonly claim: string;
  /** What the figure is measured against, in the card's footer. */
  readonly basis: string;
};

export type ProofFigure = FigureFrame &
  (
    | {
        readonly kind: 'comparison';
        readonly value: string;
        readonly before: Bar;
        readonly after: Bar;
        /**
         * Where the figure comes from: which project, measured how, by whom,
         * over what period. `null` until someone can say — and while it is
         * `null` the card stays off every public deployment (ticket 47).
         */
        readonly source: string | null;
      }
    | { readonly kind: 'commitment'; readonly value: string }
  );

/** Whether a card may be shown to the public: a commitment always, a figure only once it is sourced. */
export function isAttributed(figure: ProofFigure): boolean {
  return figure.kind === 'commitment' || figure.source !== null;
}

export const PROOF_FIGURES: readonly ProofFigure[] = [
  {
    topic: 'دورة الاعتماد',
    icon: 'approval',
    claim: 'أسرع في الاعتمادات والاستلامات',
    kind: 'comparison',
    value: '3.6×',
    before: { label: 'يدوي', height: 20 },
    after: { label: 'ربائد', height: 70 },
    basis: 'مقارنةً بالدورة الورقية على المشروع نفسه',
    source: null,
  },
  {
    topic: 'استرجاع الوثائق',
    icon: 'retrieval',
    claim: 'أسرع في استرجاع الوثائق',
    kind: 'comparison',
    value: '7×',
    before: { label: 'يدوي', height: 10 },
    after: { label: 'ربائد', height: 70 },
    basis: 'زمن الوصول إلى آخر نسخة معتمدة',
    source: null,
  },
  {
    topic: 'الوقت الإداري',
    icon: 'time',
    claim: 'توفير في وقت المهام الإدارية',
    kind: 'comparison',
    value: '31%',
    before: { label: 'قبل', height: 70 },
    after: { label: 'بعد', height: 48 },
    basis: 'من ساعات فريق المشروع الأسبوعية',
    source: null,
  },
  {
    topic: 'حوكمة الوثائق',
    icon: 'governance',
    claim: 'تحسّن في حوكمة الوثائق',
    kind: 'comparison',
    value: '22%',
    before: { label: 'قبل', height: 57 },
    after: { label: 'بعد', height: 70 },
    basis: 'اكتمال أثر كل معاملة: من أرسل، من اعتمد، ومتى',
    source: null,
  },
  {
    topic: 'التفعيل',
    icon: 'activation',
    claim: 'تفعيل ميداني كامل دون توقّف للعمل',
    kind: 'commitment',
    value: 'أقل من يوم',
    basis: 'من أول اجتماع إلى أول معاملة موثّقة',
  },
  {
    topic: 'التأهيل',
    icon: 'onboarding',
    claim: 'جلسة تعريفية واحدة لكل فريق',
    kind: 'commitment',
    value: '15 دقيقة',
    basis: 'جلسة واحدة لكل فريق، ثم العمل الفعلي',
  },
];
