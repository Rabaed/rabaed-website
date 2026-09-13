'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The header's three behaviours, attached to markup the server already sent:
 * the mobile panel, the Partnerships dropdown, and the recolouring as the page
 * crosses from a dark section into a light one.
 *
 * They work by toggling the Reference site's own classes rather than by
 * re-rendering, because the classes are what the stylesheet is written
 * against. Each effect adds its listeners and removes every one of them on
 * teardown, so React's development double-invocation cannot leave a second
 * copy behind (spec: Animation).
 *
 * Renders nothing.
 */
export function NavBehaviour() {
  useMobilePanel();
  usePartnershipsDropdown();
  useHeaderColourToggle();
  return null;
}

/** Below 981px the links are behind a button. Escape and following a link close it. */
function useMobilePanel() {
  useEffect(() => {
    const nav = document.querySelector('.nav');
    const toggle = nav?.querySelector<HTMLButtonElement>('.navtog');
    if (!nav || !toggle) return;

    const close = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const onToggle = () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    // Resizing past the breakpoint hides the button, which would otherwise
    // leave the panel open with nothing to close it.
    const onResize = () => {
      if (window.innerWidth > 980) close();
    };

    const links = [...nav.querySelectorAll('.mnav a')];
    toggle.addEventListener('click', onToggle);
    links.forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);

    return () => {
      toggle.removeEventListener('click', onToggle);
      links.forEach((link) => link.removeEventListener('click', close));
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
    };
  }, []);
}

/** Opens on hover, click and keyboard; closes on Escape, outside click and leaving. */
function usePartnershipsDropdown() {
  useEffect(() => {
    const group = document.querySelector('.nav .nsub');
    const trigger = group?.querySelector<HTMLButtonElement>('.nsub-t');
    if (!group || !trigger) return;

    let leaving: ReturnType<typeof setTimeout>;
    const set = (open: boolean) => {
      group.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const onClick = (event: Event) => {
      event.stopPropagation();
      set(!group.classList.contains('open'));
    };
    const onEnter = () => {
      clearTimeout(leaving);
      set(true);
    };
    // A grace period, so clipping the edge of the panel on the way to it does
    // not shut it in the visitor's face.
    const onLeave = () => {
      leaving = setTimeout(() => set(false), 170);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!group.contains(event.relatedTarget as Node | null)) set(false);
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (!group.contains(event.target as Node)) set(false);
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') set(false);
    };

    // Hover only where hovering is a thing a visitor can do. A touch device
    // emulates `mouseenter` on the way to a tap, so wiring it unconditionally
    // — as the Reference site does — means the tap opens the panel and then
    // immediately toggles it shut again. Below 981px this is moot because the
    // dropdown is replaced by the mobile panel, but a touchscreen laptop is
    // above it.
    const hovers = window.matchMedia('(hover: hover)').matches;

    trigger.addEventListener('click', onClick);
    if (hovers) {
      group.addEventListener('mouseenter', onEnter);
      group.addEventListener('mouseleave', onLeave);
    }
    group.addEventListener('focusout', onFocusOut as EventListener);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);

    return () => {
      clearTimeout(leaving);
      trigger.removeEventListener('click', onClick);
      group.removeEventListener('mouseenter', onEnter);
      group.removeEventListener('mouseleave', onLeave);
      group.removeEventListener('focusout', onFocusOut as EventListener);
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);
}

/**
 * Dark over the dark sections, light from the first light section until the
 * footer. The header is translucent, so without this it becomes unreadable the
 * moment a pale section slides under it.
 *
 * The colours are written as inline styles, exactly as the Reference site
 * writes them, because they have to beat `.nav`'s own background and border in
 * the cascade. `.on-light` carries everything else — the wordmark cross-fade,
 * the links, the sign-in pill, the burger.
 *
 * A page with no light section keeps the dark header and no trigger is created.
 */
function useHeaderColourToggle() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.nav');
    // A legal document's pale ground counts as a light section. It is not
    // `.light`, because its own rules set the colour of every part of it, as
    // on the Reference site; this is the rule the animated pages follow,
    // which ticket 17 asks the legal pages to share rather than the listener
    // of their own the Reference site gave them.
    const firstLight = document.querySelector('section.light, section.legal');
    if (!nav || !firstLight) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: firstLight,
      start: 'top 78px',
      endTrigger: 'footer',
      end: 'top top',
      onToggle: (self) => {
        nav.classList.toggle('on-light', self.isActive);
        nav.style.background = self.isActive ? 'rgba(250,250,248,.8)' : 'rgba(20,22,28,.72)';
        nav.style.color = self.isActive ? '#222' : '#EDEEF3';
        nav.style.borderColor = self.isActive ? '#E3E1DC' : 'rgba(255,255,255,.08)';
      },
    });

    // Section heights move once the webfont replaces the fallback, and every
    // start and end position was measured against the old ones.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      trigger.kill();
      // Leaves the header as the markup describes it, so a remount starts from
      // the same place the server rendered.
      nav.classList.remove('on-light');
      nav.style.removeProperty('background');
      nav.style.removeProperty('color');
      nav.style.removeProperty('border-color');
    };
  }, []);
}
