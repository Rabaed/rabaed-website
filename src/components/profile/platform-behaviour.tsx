'use client';

import { useEffect } from 'react';
import { FIRST_UNIT, unitAppearance } from '@/components/profile/platform-state';
import { readingDirectionOf } from '@/lib/reading-direction';
import { listenToTabs } from '@/lib/tab-strip';

/**
 * Switches the profile's platform section between its four units, attached to
 * markup the server already sent: a click, or the arrow keys, which follow the
 * reading direction and wrap round (`src/lib/tab-strip.ts`). The chosen tab
 * opens to show what its unit does, and its screen shows. Renders nothing.
 *
 * No choosing on hover, as Ahmed's has none: the chosen tab opens to its text,
 * and a list that opened and closed under a passing pointer would move the
 * tabs below it about.
 *
 * Each unit's screen pans in a box of its own, so nothing needs telling the
 * swipe hint that the screen changed (`screen-mock-pan.tsx`).
 *
 * Teardown removes every listener and puts the first unit back, so React's
 * development double-invocation starts again from what the server drew.
 */
export function PlatformBehaviour() {
  useEffect(() => {
    const section = document.getElementById('platform');
    if (!section) return;
    const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    if (tabs.length === 0 || panels.length !== tabs.length) return;

    const show = (chosen: number) => {
      tabs.forEach((tab, index) => {
        const look = unitAppearance(index, chosen);
        tab.className = look.tabClass;
        tab.setAttribute('aria-selected', look.selected);
        panels[index].className = look.panelClass;
      });
    };

    const stopListening = listenToTabs(tabs, { direction: readingDirectionOf(section), choose: show });

    return () => {
      stopListening();
      show(FIRST_UNIT);
    };
  }, []);

  return null;
}
