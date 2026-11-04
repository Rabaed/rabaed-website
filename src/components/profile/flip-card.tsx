'use client';

import { useState } from 'react';
import { Glyph } from './glyph';

/**
 * One of section 10's form cards (ticket 109): the form's code and name on
 * the front, what it is for on the back. A button, so a click, a tap, Enter
 * or Space turns it over and back again, and `aria-pressed` says which way up
 * it is — and nothing else turns it, a hover included, so what it says is
 * always what is shown. Both faces arrive in the first response, and a screen
 * reader reads them together, with JavaScript or without.
 */
export function FlipCard({ code, name, text }: { code: string; name: string; text: string }) {
  const [turned, setTurned] = useState(false);
  return (
    <button type="button" className="pf-card" aria-pressed={turned} onClick={() => setTurned((was) => !was)}>
      <span className="pf-front">
        <Glyph file="doc.png" className="pf-card-mark" />
        <b>{code}</b>
        <span>{name}</span>
      </span>
      <span className="pf-back">
        <b>{code}</b>
        <span>{text}</span>
      </span>
    </button>
  );
}
