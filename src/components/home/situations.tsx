import { CardDeck } from '@/components/home/card-deck';
import { DECK_HINT } from '@/content/card-deck';
import { FIELD_SITUATIONS } from '@/content/field-situations';

/**
 * «تعرف هذه المواقف؟» — the section after the Trust strip: six things people
 * on a construction project recognise saying, each with its cost, in a deck the
 * visitor throws through.
 *
 * The section keeps the Reference site's id, `pain`, because the stylesheet is
 * written against it and the class names and ids are load-bearing (spec:
 * Design system). Everywhere a name is ours to choose, it is "situations".
 *
 * All copy is verbatim from `reference/site/index.html`.
 */
export function Situations() {
  const total = FIELD_SITUATIONS.length;
  const cards = FIELD_SITUATIONS.map((situation, index) => (
    <>
      <div className="n">{`${twoDigits(index + 1)} / ${twoDigits(total)}`}</div>
      <q>{situation.quote}</q>
      <div className="cost">
        <div className="ct">
          <WarningIcon />
          <span>الثمن</span>
        </div>
        {situation.cost}
      </div>
    </>
  ));

  return (
    <section id="pain" className="dark">
      <div className="wrap pain-2col">
        <div className="pain-copy">
          <div className="eyebrow">مواقف من الميدان</div>
          <h2>تعرف هذه المواقف؟</h2>
          <p className="pain-close reveal">
            المشكلة ليست البريد الإلكتروني ولا الإكسل.
            <br />
            المشكلة أن الإجراء تحتها <span>يدوي، ومشتّت.</span>
          </p>
        </div>

        <CardDeck
          id="situations-deck"
          label="مواقف من الميدان — اسحب البطاقة أو استخدم الأسهم"
          previousLabel="الموقف السابق"
          nextLabel="الموقف التالي"
          hint={DECK_HINT}
          direction="rtl"
          cards={cards}
        />
      </div>
    </section>
  );
}

function twoDigits(n: number) {
  return String(n).padStart(2, '0');
}

function WarningIcon() {
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
      <path d="M10.3 3.9 1.9 18.3a1.9 1.9 0 0 0 1.7 2.9h16.8a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z" />
      <path d="M12 9.2v4.4" />
      <path d="M12 17.3v.1" />
    </svg>
  );
}
