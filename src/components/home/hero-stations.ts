/**
 * The hero diagram, as data: where the three parties stand, and the journey a
 * document makes between them.
 *
 * It sits in its own module because two components need it and they are on
 * opposite sides of the server/client line — `Hero` draws the stations into the
 * first response, `HeroLoop` moves a document between them in the browser. A
 * constant imported from a server component would drag that component into the
 * client bundle.
 *
 * Coordinates are percentages of the art box, which is a fixed 600×360 aspect
 * ratio at every width, so one set of numbers holds everywhere. They are the
 * Reference site's own, which carried them twice over — once as inline styles
 * on the markup and once as a lookup table in its script. Here the drawing and
 * the animation read the same numbers, so the document cannot come to rest
 * beside a building rather than on it.
 */

export type Station = {
  /** The party's name, shown under or above its building. */
  readonly name: string;
  /** Centre of the building, as a percentage of the art box. */
  readonly left: number;
  readonly top: number;
  /** Where the name sits, vertically — above the owner, below the other two. */
  readonly labelTop: number;
  /** The drawing, how wide it is drawn, and the size of the file it comes from. */
  readonly building: {
    readonly src: string;
    /** Drawn width, as a percentage of the art box. */
    readonly width: number;
    /** Intrinsic size of the file, so the browser reserves the right box. */
    readonly intrinsic: { readonly width: number; readonly height: number };
  };
};

export const HERO_STATIONS = {
  owner: {
    name: 'المالك',
    left: 50,
    top: 31.11,
    labelTop: 15,
    building: { src: '/hero/b-owner.webp', width: 17.8, intrinsic: { width: 369, height: 303 } },
  },
  contractor: {
    name: 'المقاول',
    left: 18.67,
    top: 75.56,
    labelTop: 95.3,
    building: { src: '/hero/b-cont.webp', width: 20.45, intrinsic: { width: 424, height: 387 } },
  },
  consultant: {
    name: 'الاستشاري',
    left: 81.33,
    top: 75.56,
    labelTop: 95.3,
    building: { src: '/hero/b-cons.webp', width: 19.29, intrinsic: { width: 400, height: 394 } },
  },
} as const satisfies Record<string, Station>;

export type StationName = keyof typeof HERO_STATIONS;

/**
 * One round of the Record: the Contractor raises a request, the Consultant
 * reviews it, the Owner approves it, and the decision comes back to all three
 * (CONTEXT.md). Each step is where the document lands and what the status pill
 * reads once it is there.
 *
 * The first entry is where the document starts, so it is also the position the
 * markup draws it at — and the position it rests at when the visitor has asked
 * for less motion.
 */
export const HERO_JOURNEY = [
  { at: 'contractor', status: 'أُرسل · 07:12' },
  { at: 'consultant', status: 'روجع · 09:20' },
  { at: 'owner', status: 'اعتُمد · 12:05' },
  { at: 'contractor', status: 'وصل السجل للأطراف الثلاثة' },
] as const satisfies readonly { at: StationName; status: string }[];

export const HERO_START = HERO_STATIONS[HERO_JOURNEY[0].at];

/**
 * What the pill reads when the loop is not going to run. The animated statuses
 * are moments in a story — "sent at 07:12" means nothing without the arrival
 * that follows it — so a still hero states the promise instead.
 */
export const HERO_STATUS_AT_REST = 'موثّق ومؤرخ';
