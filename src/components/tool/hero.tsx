import type { HeroLink } from '@/components/page-hero';
import { TestStateBadge, type TestState } from '@/components/tool/parts';

/** One of the three counts across the top of the drawing. */
export type MockTile = {
  readonly figure: string;
  readonly label: string;
  /** Coloured as a test near its date, or late; plain otherwise. */
  readonly tone?: 'warn' | 'bad';
};

/** A test in a pour's row of the drawing: which break it is, and where it stands. */
export type MockTest = {
  readonly label: string;
  readonly state: TestState;
};

/** A pour, as a row of the drawing. */
export type MockPour = {
  readonly reference: string;
  readonly name: string;
  readonly tests: readonly MockTest[];
};

/** The drawing of the tool's own screen. */
export type ToolMockContent = {
  readonly project: string;
  readonly tiles: readonly MockTile[];
  readonly pours: readonly MockPour[];
};

export type ToolHeroContent = {
  readonly eyebrow: string;
  /** The heading, up to its last words. */
  readonly title: string;
  /** Its last words, in the accent colour. */
  readonly titleAccent: string;
  readonly lead: string;
  /** The filled button. */
  readonly primary: HeroLink;
  /** The outlined one beside it. */
  readonly secondary: HeroLink;
  /** The ticked promises under the buttons. */
  readonly promises: readonly string[];
  readonly mock: ToolMockContent;
};

/** The Reference site's gold and accent, as it writes them into the drawing. */
const TILE_COLOURS = { warn: '#CCA840', bad: '#F95738' } as const;

/**
 * The tool page's hero: what the Pour Tracker does, its two calls to action,
 * four promises, and beside them a drawing of the tool's own screen.
 *
 * **The drawing is markup, not an exported Screen mock**, and hidden from
 * assistive technology, as on the Reference site. ADR-0002 turns Rabaed app
 * screens into images because they are thousands of lines of machine-made
 * markup; this is a few dozen lines drawing the Pour Tracker, a tool the visitor
 * downloads, and every claim in it — the countdowns to 7 and 28 days, a test
 * running late — is said in words beside it.
 */
export function ToolHero({ content }: { content: ToolHeroContent }) {
  return (
    <section className="phero dark">
      <div className="pglow" />
      <div className="wrap">
        <div className="tl-hero">
          <div>
            <div className="eyebrow">{content.eyebrow}</div>
            <h1>
              {content.title}
              <span style={{ color: 'var(--acc)' }}>{content.titleAccent}</span>
            </h1>
            <p className="lead">{content.lead}</p>
            <div className="ctas">
              <a className="btn p" href={content.primary.href}>
                {content.primary.label}
              </a>
              <a className="btn g" href={content.secondary.href}>
                {content.secondary.label}
              </a>
            </div>
            <div className="tl-chips">
              {content.promises.map((promise) => (
                <span key={promise} className="tl-chip">
                  <i>✓</i>
                  {promise}
                </span>
              ))}
            </div>
          </div>

          <ToolMock content={content.mock} />
        </div>
      </div>
    </section>
  );
}

function ToolMock({ content }: { content: ToolMockContent }) {
  return (
    <div className="tl-mock" aria-hidden="true">
      <div className="tl-mh">
        <span className="d" />
        <span className="d" />
        <span className="d" />
        <b>{content.project}</b>
      </div>
      <div className="tiles">
        {content.tiles.map((tile) => (
          <div key={tile.label} className="tile">
            <b style={tile.tone === undefined ? undefined : { color: TILE_COLOURS[tile.tone] }}>{tile.figure}</b>
            <small>{tile.label}</small>
          </div>
        ))}
      </div>
      {content.pours.map((pour) => (
        <div key={pour.reference} className="tl-row">
          <span className="rf">{pour.reference}</span>
          <span className="rn">{pour.name}</span>
          <div className="rm">
            {pour.tests.map((test) => (
              <div key={test.label}>
                <span className="mk">{test.label}</span>
                <TestStateBadge state={test.state} className="tl-s" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
