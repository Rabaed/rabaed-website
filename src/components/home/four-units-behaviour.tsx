'use client';

import { useEffect } from 'react';
import { FIRST_CHOSEN, unitTabAppearance } from '@/components/home/four-units-state';
import { SCREEN_MOCK_CHANGED } from '@/components/screen-mock-pan';
import { readingDirectionOf } from '@/lib/reading-direction';
import { listenToTabs } from '@/lib/tab-strip';

/**
 * Switches the four-units section between its tabs, attached to markup the
 * server already sent: a click, the pointer arriving over a tab, or the arrow
 * keys, exactly as on the Reference site (`src/lib/tab-strip.ts`). The chosen
 * tab is marked, its screen fades in and its caption shows. Renders nothing.
 *
 * **Hover switches too, and that is safe on a touchscreen.** A tap sends the
 * pointer's arrival and then the click, both naming the same tab — unlike the
 * header's dropdown (ticket 04), where the click toggled what the arrival had
 * just opened, there is nothing here for the second event to undo.
 *
 * Teardown removes every listener and puts the first tab back, so React's
 * development double-invocation starts again from what the server drew.
 */
export function FourUnitsBehaviour() {
  useEffect(() => {
    const section = document.getElementById('jt');
    if (!section) return;
    const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const hints = [...section.querySelectorAll<HTMLElement>('.jt-hint')];
    if (tabs.length === 0 || panels.length !== tabs.length || hints.length !== tabs.length) return;

    const stage = section.querySelector<HTMLElement>('[data-pan]');
    let shown = FIRST_CHOSEN;

    const show = (chosen: number) => {
      // A different unit's screen: on a phone it starts where panning begins,
      // with its own swipe hint (ticket 77). The pointer arriving over the
      // tab already shown, as a tap's first event does, changes nothing.
      if (chosen !== shown) stage?.dispatchEvent(new Event(SCREEN_MOCK_CHANGED));
      shown = chosen;
      tabs.forEach((tab, index) => {
        const look = unitTabAppearance(index, chosen);
        tab.className = look.tabClass;
        tab.setAttribute('aria-selected', look.selected);
        panels[index].className = look.panelClass;
        hints[index].hidden = look.hintHidden;
      });
    };

    const stopListening = listenToTabs(tabs, {
      direction: readingDirectionOf(section),
      choose: show,
      chooseOnHover: true,
    });

    return () => {
      stopListening();
      show(FIRST_CHOSEN);
    };
  }, []);

  return null;
}
