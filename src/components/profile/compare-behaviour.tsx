'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { readingDirectionOf } from '@/lib/reading-direction';
import { listenToTabs } from '@/lib/tab-strip';

/** How much of a video has to be on screen for it to play: half, as Ahmed's. */
const ON_SCREEN = 0.5;

/** What Chromium tells a page about the visitor's connection; other browsers tell it nothing. */
type Connection = { readonly saveData?: boolean; readonly effectiveType?: string };

/**
 * Whether the visitor's connection asks a page to fetch less: Save-Data, or a
 * 2G connection (`2g`, `slow-2g`). A browser that does not say is taken to be
 * on a fast one.
 */
function fetchLess(): boolean {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  return Boolean(connection && (connection.saveData || /2g/.test(connection.effectiveType ?? '')));
}

/**
 * The before-and-after section's tabs and videos (ticket 108), attached to
 * markup the server already sent. Renders nothing.
 *
 * **A video plays by itself, muted and looping, while half of it is on
 * screen** and its tab is the chosen one, and pauses when it leaves the
 * screen, when its tab is left, and when the browser tab is. Its source is
 * set the first time it is due, never before. With reduced motion, Save-Data
 * or a 2G connection, it waits behind its poster for its button, which starts
 * it in any case; once started it pauses off screen like the rest. Started, it
 * shows the browser's controls, so a visitor can stop it.
 *
 * Teardown pauses every video, removes every listener and puts the first tab
 * back, so React's development double-invocation starts again from what the
 * server drew.
 */
export function CompareBehaviour() {
  useEffect(() => {
    const section = document.getElementById('compare');
    if (!section) return;
    const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const clips = panels.map((panel) => panel.querySelector<HTMLElement>('[data-clip]'));
    if (tabs.length === 0 || panels.length !== tabs.length || clips.some((clip) => !clip)) return;

    const byItself = !prefersReducedMotion() && !fetchLess();
    const onScreen = new Set<HTMLElement>();
    let chosen = 0;

    const videoOf = (clip: HTMLElement) => clip.querySelector('video')!;

    const start = (clip: HTMLElement) => {
      const video = videoOf(clip);
      if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
      // The attribute alone is not enough for every browser to let a video play by itself.
      video.muted = true;
      video.controls = true;
      clip.classList.add('playing');
      // Refused — a file this browser cannot play — the poster and its button come back.
      video.play().catch(() => clip.classList.remove('playing'));
    };

    const pause = (clip: HTMLElement) => videoOf(clip).pause();

    /** The chosen tab's video, playing if it may and is on screen. */
    const playChosenIfDue = () => {
      const clip = clips[chosen]!;
      if (byItself && onScreen.has(clip) && document.visibilityState === 'visible') start(clip);
    };

    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const clip = entry.target as HTMLElement;
          if (entry.isIntersecting) onScreen.add(clip);
          else {
            onScreen.delete(clip);
            pause(clip);
          }
        }
        playChosenIfDue();
      },
      { threshold: ON_SCREEN },
    );
    for (const clip of clips) watch.observe(clip!);

    const show = (index: number) => {
      chosen = index;
      tabs.forEach((tab, each) => tab.setAttribute('aria-selected', String(each === index)));
      panels.forEach((panel, each) => panel.classList.toggle('on', each === index));
      clips.forEach((clip, each) => {
        if (each !== index) pause(clip!);
      });
    };

    const stopListening = listenToTabs(tabs, {
      direction: readingDirectionOf(section),
      choose: (index) => {
        show(index);
        // A phone's row of tabs scrolls sideways: the one chosen stays in it, and the page stays where it is.
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        playChosenIfDue();
      },
    });

    const buttons = clips.map((clip) => {
      const button = clip!.querySelector<HTMLButtonElement>('.pf-clip-play')!;
      const press = () => start(clip!);
      button.addEventListener('click', press);
      return () => button.removeEventListener('click', press);
    });

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') clips.forEach((clip) => pause(clip!));
      else playChosenIfDue();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      watch.disconnect();
      stopListening();
      buttons.forEach((remove) => remove());
      document.removeEventListener('visibilitychange', onVisibility);
      clips.forEach((clip) => pause(clip!));
      show(0);
    };
  }, []);

  return null;
}
