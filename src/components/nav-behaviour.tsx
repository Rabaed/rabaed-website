'use client';

import { useEffect } from 'react';

/**
 * Where the header's lower edge sits: 78px, the offset the Reference site
 * gives its colour toggle and the one ScrollTrigger was given here.
 */
const HEADER_HEIGHT = 78;

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
  useRememberedLanguage();
  return null;
}

/** Where the language a visitor picked is kept. One browser's, and nobody else's. */
const LANGUAGE_KEY = 'rabaed:language';

/**
 * Remembers the language a visitor chooses, and marks the switcher when they
 * are reading the other one (ticket 40).
 *
 * **It never sends anybody anywhere** (ADR-0014). Every address serves the
 * language it names, first visit or fiftieth, so a shared link shows what it
 * says and a crawler following `hreflang` is not bounced. What the record buys
 * is that a visitor who chose English last week and lands on an Arabic page —
 * from a search result, from a colleague — finds the way back marked rather
 * than having to look for it.
 *
 * `localStorage` is empty in a private window, on another device, and wherever
 * site data is cleared or blocked, and reading it can throw outright. So every
 * touch of it is wrapped, and the page is correct without it: the mark is an
 * addition to a switcher that already works.
 */
function useRememberedLanguage() {
  useEffect(() => {
    const switches = [...document.querySelectorAll<HTMLAnchorElement>('.nav [data-language]')];
    if (switches.length === 0) return;

    const remember = (event: Event) => {
      const chosen = (event.currentTarget as HTMLElement).dataset.language;
      if (!chosen) return;
      try {
        window.localStorage.setItem(LANGUAGE_KEY, chosen);
      } catch {
        // Blocked or full. The link still leads where it leads.
      }
    };

    let remembered: string | null = null;
    try {
      remembered = window.localStorage.getItem(LANGUAGE_KEY);
    } catch {
      remembered = null;
    }

    // Marked only where the remembered language is the one being offered —
    // that is, where the visitor is reading the language they did not pick.
    for (const link of switches) {
      if (remembered && link.dataset.language === remembered) link.dataset.remembered = 'true';
      link.addEventListener('click', remember);
    }

    return () => {
      for (const link of switches) link.removeEventListener('click', remember);
    };
  }, []);
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
 * A page with no light section keeps the dark header and nothing is listened
 * for.
 *
 * **No GSAP here, deliberately (ticket 36).** This was a `ScrollTrigger`, and
 * because the header is on every page, every page therefore carried GSAP and
 * ScrollTrigger — about 70 KB of animation library — for a class and three
 * inline styles. The tool, referral, partnership, legal, blog and English
 * pages use the library for nothing else, and the spec's performance budget
 * says a page must not ship it where it is unused (spec: Analytics and
 * performance). Those pages now ship none. GSAP is still the site's one
 * animation library, and the home, product and start pages still load it for
 * animations that are actually animations. The Reference tool page settles
 * this the same way: a plain scroll listener, and no GSAP at all.
 *
 * The two positions are the ones ScrollTrigger was given — `top 78px` on the
 * first light section, `top top` on the footer — read straight off the two
 * elements, and read on every scroll rather than measured once, so a section
 * that changes height needs no refreshing.
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
    const footer = document.querySelector('footer');
    if (!nav || !firstLight) return;

    // What the markup the server sent already shows, so that a page opened at
    // the top writes nothing: `.nav`'s own rule sets a bottom border and lets
    // the other three edges follow the text colour, and writing the dark
    // values over it would put a border on all four.
    let onLight = false;
    const paint = () => {
      // Light from the moment the section's top edge passes under the header,
      // and back to dark once the footer's top edge reaches the window's.
      const light = firstLight.getBoundingClientRect().top <= HEADER_HEIGHT && (footer?.getBoundingClientRect().top ?? Infinity) > 0;
      if (light === onLight) return;
      onLight = light;

      // Written as inline styles, exactly as the Reference site writes them,
      // because they have to beat `.nav`'s own background and border in the
      // cascade.
      nav.classList.toggle('on-light', light);
      nav.style.background = light ? 'rgba(250,250,248,.8)' : 'rgba(20,22,28,.72)';
      nav.style.color = light ? '#222' : '#EDEEF3';
      nav.style.borderColor = light ? '#E3E1DC' : 'rgba(255,255,255,.08)';
    };

    // Once per frame at most: a scroll fires far more often than the screen is
    // drawn, and reading a box forces layout.
    let pending = 0;
    const onScroll = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        paint();
      });
    };

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Section heights move once the webfont replaces the fallback, and a page
    // opened part-way down is already past the boundary by then.
    void document.fonts.ready.then(paint);

    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      // Leaves the header as the markup describes it, so a remount starts from
      // the same place the server rendered.
      nav.classList.remove('on-light');
      nav.style.removeProperty('background');
      nav.style.removeProperty('color');
      nav.style.removeProperty('border-color');
    };
  }, []);
}
