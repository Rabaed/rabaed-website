'use client';

import { useEffect } from 'react';
import { FIRST_CHOSEN, unitTabAppearance } from '@/components/home/four-units-state';
import { ARROW_KEYS, readingDirectionOf } from '@/lib/reading-direction';

/**
 * Switches the four-units section between its tabs, attached to markup the
 * server already sent: a click, the pointer arriving over a tab, or the arrow
 * keys, exactly as on the Reference site. The chosen tab is marked, its screen
 * fades in and its caption shows. Renders nothing.
 *
 * **Hover switches too, and that is safe on a touchscreen.** A tap sends the
 * pointer's arrival and then the click, both naming the same tab — unlike the
 * header's dropdown (ticket 04), where the click toggled what the arrival had
 * just opened, there is nothing here for the second event to undo.
 *
 * **The arrow keys follow the reading direction** the server wrote onto the
 * section: in Arabic the next tab is to the left. Either end wraps round to the
 * other, and focus moves with the choice.
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

    const keys = ARROW_KEYS[readingDirectionOf(section)];

    const show = (chosen: number) => {
      tabs.forEach((tab, index) => {
        const look = unitTabAppearance(index, chosen);
        tab.className = look.tabClass;
        tab.setAttribute('aria-selected', look.selected);
        panels[index].className = look.panelClass;
        hints[index].hidden = look.hintHidden;
      });
    };

    const undo = tabs.map((tab, index) => {
      const choose = () => show(index);
      const onKeyDown = (event: KeyboardEvent) => {
        const step = event.key === keys.forward ? 1 : event.key === keys.back ? -1 : 0;
        if (step === 0) return;
        event.preventDefault();
        const next = (index + step + tabs.length) % tabs.length;
        tabs[next].focus();
        show(next);
      };

      tab.addEventListener('click', choose);
      tab.addEventListener('mouseenter', choose);
      tab.addEventListener('keydown', onKeyDown);
      return () => {
        tab.removeEventListener('click', choose);
        tab.removeEventListener('mouseenter', choose);
        tab.removeEventListener('keydown', onKeyDown);
      };
    });

    return () => {
      undo.forEach((remove) => remove());
      show(FIRST_CHOSEN);
    };
  }, []);

  return null;
}
