'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { WholeScreenWords } from '@/content/site-words';

/**
 * Marks the step in the browser's history that an opened screen adds, with
 * the id of the screen it is: each screen acts on its own step and no other's.
 */
const OPENED = 'screenMockWhole';

/** The screen whose step the browser is on, if any. */
const stepOf = (): string | undefined => window.history.state?.[OPENED];

/**
 * The step a closed screen is taking back off, until it has: `history.back()`
 * lands a moment after it is called. A screen opened in that moment would
 * add its own step first and then be closed by the one landing.
 */
let leaving: Promise<void> | null = null;

/** Takes an opened screen's step back off, and says when it has. */
function leave(): void {
  leaving = new Promise((done) => {
    window.addEventListener(
      'popstate',
      // After every other listener has heard it: one of them may be the
      // screen that is closing.
      () => setTimeout(() => ((leaving = null), done())),
      { once: true },
    );
  });
  window.history.back();
}

/**
 * The button over a Phone crop, and the whole screen it opens (ticket 78,
 * ADR-0022).
 *
 * On a phone a Screen mock is shown as its Phone crop, and this is what stops
 * the crop from being all a visitor can see: the whole crop is one button,
 * saying at its foot that it opens the whole screen, and tapped it opens the
 * whole screen over the page. There it is fitted to the phone's width, and
 * the zoom button draws it at its own 1440px to be panned across. Its close
 * button, Escape and the phone's back gesture each close it.
 *
 * **The back gesture closes it, not the page.** Opening it adds a step to the
 * browser's history, at the same address; going back takes that step off and
 * the screen closes with it. Closing it any other way takes the step back off
 * too, so it never leaves a step behind that goes back to nothing.
 *
 * **The whole screen is not fetched until it is opened.** A phone shown the
 * crops has no use for the whole screens until a visitor asks for one, and
 * each is two to four times the crop's weight. It is the whole screen's file
 * as it is — the export, at twice the stage, or an Editor's replacement as
 * they uploaded it (ticket 79) — which zoomed in is what a dense screen needs.
 *
 * Above 700px the stylesheet hides the button, and the page shows the whole
 * screen as it always has (`src/styles/screen-mocks.css`).
 */
export function ScreenMockWhole({
  src,
  width,
  height,
  description,
  words,
}: {
  /** The whole screen's file: the export, or the replacement an Editor uploaded. */
  src: string;
  /** The screen's stage, which the opened picture is drawn at when zoomed in. */
  width: number;
  height: number;
  /** The Screen mock's description (ADR-0002): the opened screen's name, and its picture's `alt`. */
  description: string;
  words: WholeScreenWords;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const box = dialog.current;
    if (!box) return;

    // Going back took this screen's step off already; closing must not take
    // another.
    const back = () => {
      if (box.open && stepOf() !== id) box.close('back');
    };
    // Its own step only: a screen opened in the moment this one closed has
    // taken the step over, and keeps it.
    const closed = () => {
      setZoomed(false);
      if (box.returnValue !== 'back' && stepOf() === id) leave();
    };

    window.addEventListener('popstate', back);
    box.addEventListener('close', closed);
    return () => {
      window.removeEventListener('popstate', back);
      box.removeEventListener('close', closed);
    };
  }, [id]);

  const open = async () => {
    if (leaving) await leaving;
    const box = dialog.current;
    if (!box || box.open) return;
    setOpened(true);
    box.returnValue = '';
    box.showModal();
    // Already on a screen's step — one closing as this opens, or one a visitor
    // went back past and forward onto again — this screen takes it over, so
    // there is only ever one, and closing leaves none behind.
    if (stepOf()) window.history.replaceState({ [OPENED]: id }, '');
    else window.history.pushState({ [OPENED]: id }, '');
  };

  return (
    <>
      <button type="button" className="shot-open" onClick={open}>
        <span className="shot-open-label">
          <svg className="shot-open-i" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" />
          </svg>
          {words.open}
        </span>
      </button>
      <dialog ref={dialog} className="shot-whole" aria-label={description}>
        <div className="shot-whole-bar">
          <button type="button" className="shot-whole-btn" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
            {words.zoom}
          </button>
          <button type="button" className="shot-whole-btn" onClick={() => dialog.current?.close()}>
            {words.close}
          </button>
        </div>
        <div className="shot-whole-view" data-zoomed={zoomed}>
          {opened ? (
            // The file as it is: `next/image` would size it for a phone's
            // width, and zoomed in it is drawn at the stage's.
            <img src={src} alt={description} width={width} height={height} onClick={() => setZoomed(!zoomed)} />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
