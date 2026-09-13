import type { ReactNode } from 'react';
import { CardDeck } from '@/components/home/card-deck';
import { DECK_HINT } from '@/content/card-deck';
import { PROOF_FIGURES, isAttributed, type ProofIcon } from '@/content/proof-figures';
import { isPubliclyDeployed } from '@/lib/environment';

/**
 * «ماذا يتغيّر بعد التشغيل؟» — what changes once a project runs on Rabaed, as a
 * light deck of figures beside the heading.
 *
 * **A figure without a recorded source is left off every public deployment**
 * (ticket 47; see `src/content/proof-figures.ts`). Local builds and the test
 * suite draw all six cards, so the deck is tested and compared whole; a preview
 * or production deployment draws only what may be published.
 *
 * **The Reference site's testimonial slot is not here.** Under the lead it
 * carries a card that says, in so many words, "placeholder — waiting for the
 * recorded testimonial", attributed to a project manager at a Riyadh developer
 * who does not exist yet, around a play button that plays nothing. A
 * testimonial is one of the things the spec forbids inventing; the slot comes
 * back when a real one has been recorded. The deck's column is aligned to the
 * top of the section, so leaving it out moves nothing but the section's height.
 *
 * The section keeps the Reference site's id, `proof`, because the stylesheet is
 * written against it (spec: Design system). Everywhere a name is ours to
 * choose, it is "figures".
 *
 * All copy is verbatim from `reference/site/index.html`.
 */
export function Figures() {
  const shown = isPubliclyDeployed() ? PROOF_FIGURES.filter(isAttributed) : PROOF_FIGURES;

  const cards = shown.map((figure) => (
    <>
      <div className="phead">
        <span className="topic">{figure.topic}</span>
        <i className="ic" aria-hidden="true">
          <TopicIcon name={figure.icon} />
        </i>
      </div>
      <div className="chead">{figure.claim}</div>
      <div className="pbody">
        {figure.kind === 'comparison' ? (
          <>
            <b className="big">{figure.value}</b>
            {/* Two bars drawn to scale: before and after. Decorative — the
                figure beside them is the claim, stated in text. */}
            <div className="mark" aria-hidden="true">
              <span style={{ height: `${figure.before.height}px` }}>
                <em>{figure.before.label}</em>
              </span>
              <span className="on" style={{ height: `${figure.after.height}px` }}>
                <em>{figure.after.label}</em>
              </span>
            </div>
          </>
        ) : (
          <b className="txtnum">{figure.value}</b>
        )}
      </div>
      <div className="src">
        <InfoIcon />
        <span>{figure.basis}</span>
      </div>
    </>
  ));

  return (
    <section id="proof" className="light pad">
      <div className="wrap">
        <div className="proof-2col">
          <div className="proof-copy">
            <div className="eyebrow">الأثر</div>
            <h2>ماذا يتغيّر بعد التشغيل؟</h2>
            <p className="lead">
              الفرق بين إجراء يدوي مشتّت وإجراء واحد موثّق — على مشروع يعمل فيه المالك والاستشاري
              والمقاول على المنصة نفسها.
            </p>
          </div>

          <CardDeck
            id="figures-deck"
            label="أرقام الأثر — اسحب البطاقة أو استخدم الأسهم"
            previousLabel="الرقم السابق"
            nextLabel="الرقم التالي"
            hint={DECK_HINT}
            direction="rtl"
            tone="light"
            cards={cards}
          />
        </div>
      </div>
    </section>
  );
}

const TOPIC_ICONS: Record<ProofIcon, ReactNode> = {
  approval: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9.2 14.4l2.1 2.1 3.5-4.1" />
    </>
  ),
  retrieval: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5L21 21" />
      <path d="M8.4 9.4h4.8M8.4 12.2h3.2" />
    </>
  ),
  time: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 1.9" />
    </>
  ),
  governance: (
    <>
      <path d="M12 3.2l7 2.9v5.4c0 4.1-2.9 7.5-7 8.9-4.1-1.4-7-4.8-7-8.9V6.1z" />
      <path d="M9.2 11.9l2.1 2.1 3.6-4" />
    </>
  ),
  activation: <path d="M13.4 3L5.6 13.4h4.9L10 21l8.4-10.4h-5.1z" />,
  onboarding: (
    <>
      <circle cx="9.2" cy="8.6" r="3.1" />
      <path d="M3.6 19.6c0-3 2.5-5.1 5.6-5.1s5.6 2.1 5.6 5.1" />
      <path d="M15.9 6.1a3 3 0 0 1 0 5.5" />
      <path d="M17.4 14.9c2 .6 3.1 2.4 3.1 4.7" />
    </>
  ),
};

function TopicIcon({ name }: { name: ProofIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TOPIC_ICONS[name]}
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8.2h.01" />
    </svg>
  );
}
