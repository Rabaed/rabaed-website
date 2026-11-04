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
 * shows the browser's controls, and one the visitor stops with them stays
 * stopped until they start it again.
 *
 * Teardown pauses every video, removes every listener and puts the first tab
 * back, for React's development double-invocation.
 */
export function CompareBehaviour() {
  useEffect(() => {
    const section = document.getElementById('compare');
    if (!section) return;
    const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...section.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    const clips = panels.flatMap((panel) => panel.querySelector<HTMLElement>('[data-clip]') ?? []);
    if (tabs.length === 0 || panels.length !== tabs.length || clips.length !== tabs.length) return;

    const byItself = !prefersReducedMotion() && !fetchLess();
    const onScreen = new Set<HTMLElement>();
    /** Videos this code paused, whose `pause` event is therefore not the visitor's. */
    const pausedHere = new Set<HTMLVideoElement>();
    /** Videos the visitor stopped with the controls, which nothing here starts again. */
    const stoppedByVisitor = new Set<HTMLVideoElement>();
    let chosen = 0;

    const videoOf = (clip: HTMLElement) => clip.querySelector('video')!;

    const start = (clip: HTMLElement) => {
      const video = videoOf(clip);
      stoppedByVisitor.delete(video);
      // A pause of ours that never came to an event is no longer waiting for one.
      pausedHere.delete(video);
      if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
      // The attribute alone is not enough for every browser to let a video play by itself.
      video.muted = true;
      video.controls = true;
      clip.classList.add('playing');
      // Refused — a file this browser cannot play, or a pause before it began —
      // the poster and its button come back.
      video.play().catch(() => clip.classList.remove('playing'));
    };

    const pause = (clip: HTMLElement) => {
      const video = videoOf(clip);
      if (video.paused) return;
      pausedHere.add(video);
      video.pause();
    };

    const onPause = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      if (!pausedHere.delete(video)) stoppedByVisitor.add(video);
    };
    const onPlay = (event: Event) => stoppedByVisitor.delete(event.target as HTMLVideoElement);
    for (const clip of clips) {
      videoOf(clip).addEventListener('pause', onPause);
      videoOf(clip).addEventListener('play', onPlay);
    }

    /** The chosen tab's video, playing if it may and is on screen. */
    const playChosenIfDue = () => {
      const clip = clips[chosen];
      const due = byItself && onScreen.has(clip) && document.visibilityState === 'visible';
      if (due && !stoppedByVisitor.has(videoOf(clip))) start(clip);
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
    for (const clip of clips) watch.observe(clip);

    const show = (index: number) => {
      chosen = index;
      tabs.forEach((tab, each) => tab.setAttribute('aria-selected', String(each === index)));
      panels.forEach((panel, each) => panel.classList.toggle('on', each === index));
      clips.forEach((clip, each) => {
        if (each !== index) pause(clip);
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
      const button = clip.querySelector<HTMLButtonElement>('.pf-clip-play')!;
      const press = () => start(clip);
      button.addEventListener('click', press);
      return () => button.removeEventListener('click', press);
    });

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') clips.forEach(pause);
      else playChosenIfDue();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      watch.disconnect();
      stopListening();
      buttons.forEach((remove) => remove());
      document.removeEventListener('visibilitychange', onVisibility);
      clips.forEach(pause);
      for (const clip of clips) {
        videoOf(clip).removeEventListener('pause', onPause);
        videoOf(clip).removeEventListener('play', onPlay);
      }
      show(0);
    };
  }, []);

  return null;
}
