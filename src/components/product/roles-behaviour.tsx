'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FIRST_ROLE, roleAppearance } from '@/components/product/roles-state';
import { readingDirectionOf } from '@/lib/reading-direction';
import { listenToTabs } from '@/lib/tab-strip';

/**
 * Switches the roles section between the three parties, attached to markup the
 * server already sent. Renders nothing.
 *
 * **A click chooses, as on the Reference site; the arrow keys choose too**,
 * which the Reference site's tabs do not. They are marked up as tabs, and a
 * tab list whose arrow keys do nothing is a broken promise to a keyboard user;
 * the four units on the home page already move this way
 * (`src/lib/tab-strip.ts`). There is no choosing on hover here, because the
 * Reference site has none.
 *
 * **Every choice re-measures the page's scroll triggers**, as the Reference
 * site's does. The three parties' copy is not the same length, so the page
 * below changes height, and the header's colour toggle ends at the footer.
 *
 * Teardown removes every listener and puts the first party back, so React's
 * development double-invocation starts again from what the server drew.
 */
export function RolesBehaviour() {
  useEffect(() => {
    const section = document.getElementById('roles');
    if (!section) return;
    const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    if (tabs.length === 0 || panels.length !== tabs.length) return;

    gsap.registerPlugin(ScrollTrigger);

    const show = (chosen: number) => {
      tabs.forEach((tab, index) => {
        const look = roleAppearance(index, chosen);
        tab.className = look.tabClass;
        tab.setAttribute('aria-selected', look.selected);
        panels[index].className = look.panelClass;
      });
    };

    const stopListening = listenToTabs(tabs, {
      direction: readingDirectionOf(section),
      choose: (chosen) => {
        show(chosen);
        ScrollTrigger.refresh();
      },
    });

    return () => {
      stopListening();
      show(FIRST_ROLE);
    };
  }, []);

  return null;
}
