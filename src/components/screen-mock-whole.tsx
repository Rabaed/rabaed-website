'use client';

import { useEffect, useRef, useState } from 'react';
import type { WholeScreenWords } from '@/content/site-words';

/** Marks the step in the browser's history that an opened screen adds. */
const OPENED = 'screenMockWhole';

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
 * each is two to four times the crop's weight. It is the exported file as it
 * is, at twice the stage, which zoomed in is what a dense screen needs.
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
  /** The whole screen's exported file. */
  src: string;
  /** The screen's stage, which the opened picture is drawn at when zoomed in. */
  width: number;
  height: number;
  /** The Screen mock's description (ADR-0002): the opened screen's name, and its picture's `alt`. */
  description: string;
  words: WholeScreenWords;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const box = dialog.current;
    if (!box) return;

    // Going back took the step off already; closing must not take another.
    const back = () => {
      if (box.open) box.close('back');
    };
    const closed = () => {
      setZoomed(false);
      if (box.returnValue !== 'back' && window.history.state?.[OPENED]) window.history.back();
    };

    window.addEventListener('popstate', back);
    box.addEventListener('close', closed);
    return () => {
      window.removeEventListener('popstate', back);
      box.removeEventListener('close', closed);
    };
  }, []);

  const open = () => {
    const box = dialog.current;
    if (!box || box.open) return;
    setOpened(true);
    box.returnValue = '';
    box.showModal();
    window.history.pushState({ [OPENED]: true }, '');
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
            // The exported file as it is: `next/image` would size it for a
            // phone's width, and zoomed in it is drawn at the stage's.
            <img src={src} alt={description} width={width} height={height} onClick={() => setZoomed(!zoomed)} />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
