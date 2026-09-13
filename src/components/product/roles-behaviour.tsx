'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FIRST_ROLE, roleAppearance } from '@/components/product/roles-state';
import { ARROW_KEYS, readingDirectionOf } from '@/lib/reading-direction';

/**
 * Switches the roles section between the three parties, attached to markup the
 * server already sent. Renders nothing.
 *
 * **A click chooses, as on the Reference site; the arrow keys choose too**,
 * which the Reference site's tabs do not. They are marked up as tabs, and a
 * tab list whose arrow keys do nothing is a broken promise to a keyboard
 * user; the four units on the home page already move this way, in the reading
 * direction the server wrote. There is no choosing on hover here, because the
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
    const keys = ARROW_KEYS[readingDirectionOf(section)];

    const show = (chosen: number) => {
      tabs.forEach((tab, index) => {
        const look = roleAppearance(index, chosen);
        tab.className = look.tabClass;
        tab.setAttribute('aria-selected', look.selected);
        panels[index].className = look.panelClass;
      });
    };

    const choose = (chosen: number) => {
      show(chosen);
      ScrollTrigger.refresh();
    };

    const undo = tabs.map((tab, index) => {
      const onClick = () => choose(index);
      const onKeyDown = (event: KeyboardEvent) => {
        const step = event.key === keys.forward ? 1 : event.key === keys.back ? -1 : 0;
        if (step === 0) return;
        event.preventDefault();
        const next = (index + step + tabs.length) % tabs.length;
        tabs[next].focus();
        choose(next);
      };

      tab.addEventListener('click', onClick);
      tab.addEventListener('keydown', onKeyDown);
      return () => {
        tab.removeEventListener('click', onClick);
        tab.removeEventListener('keydown', onKeyDown);
      };
    });

    return () => {
      undo.forEach((remove) => remove());
      show(FIRST_ROLE);
    };
  }, []);

  return null;
}
