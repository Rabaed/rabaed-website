import { SectionEyebrow } from './section-eyebrow';

/** The paper photo: Ahmed's, unless an Editor has put another in its place. */
export type PaperPhoto = {
  readonly src: string;
  readonly srcSet: string;
  readonly width: number;
  readonly height: number;
  /** Read out in place of the photo: empty for Ahmed's, which the caption under it describes. */
  readonly alt: string;
};

export type ProfileTruthContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly photo: PaperPhoto;
  readonly caption: string;
  /** The three red notes, in the order they are pinned to the sheet: at the revision, the handwritten comments and the signatures. */
  readonly notes: readonly [string, string, string];
};

/**
 * Ahmed's photo, from `public/profile/`, at its two widths. Its alternative
 * text is empty: the caption under it says what it is, and a screen reader
 * would otherwise read that twice.
 */
export const DEFAULT_PAPER_PHOTO: PaperPhoto = {
  src: '/profile/paper-800.webp',
  srcSet: '/profile/paper-480.webp 480w, /profile/paper-800.webp 800w',
  width: 800,
  height: 1069,
  alt: '',
};

/** The red rings, each round the place on the sheet its note is about. */
const RINGS = ['rev', 'comments', 'who'] as const;

/**
 * Section 01 of the Company profile, "Here's the truth" (`#truth`, ticket
 * 105): Ahmed's heading and paragraph beside his photo of a real paper
 * submittal, its names and stamps hidden, tilted on the page with three
 * red-pen rings and three red notes pinned to it, and his caption under it.
 *
 * The rings and the notes are placed over the sheet as the photo has it, which
 * is the same in either language: their places are physical, not turned round
 * for English. A dark section.
 */
export function Truth({ content }: { content: ProfileTruthContent }) {
  const { photo } = content;
  return (
    <section id="truth" className="pad pf-truth">
      <div className="wrap pf-split">
        <div>
          <SectionEyebrow number="01" words={content.eyebrow} />
          <h2>{content.title}</h2>
          <p className="lead">{content.body}</p>
        </div>
        <figure className="pf-paper">
          <div className="pf-sheet">
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(max-width: 980px) 86vw, 440px"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
            {RINGS.map((ring) => (
              <span key={ring} className={`pf-ring pf-ring-${ring}`} aria-hidden="true" />
            ))}
            {content.notes.map((note, index) => (
              <span key={RINGS[index]} className={`pf-note pf-note-${RINGS[index]}`}>
                {note}
              </span>
            ))}
          </div>
          <figcaption>{content.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
