# 50: Bug — the hero's pulse ring test fails on a busy machine

**What is wrong:** `the hero › the pulse ring shows where the document landed` in `tests/e2e/home-hero.spec.ts` sometimes fails with "the pulse ring never appeared", though nothing is wrong with the ring.

**Reported by:** a full-suite run on 13 September 2026 (10 workers, other sessions possibly running suites on the same machine; 2.0 minutes against the usual 1.1). The run before it passed, and the test alone passed 5 times in 5.

**Blocked by:** nothing.

**Status:** resolved

## Why it happens

The test polled `#h-pulse`'s opacity with `expect.poll` and its defaults. Two things about the hero loop (`src/components/home/hero-loop.tsx`) make that a gamble:

- **The ring is visible only briefly.** Each pulse fades from 0.85 to 0 over 0.95 seconds on `power2.out`, so it is above the test's 0.1 threshold for only the first 0.62 seconds. `expect.poll` backs off to one look a second, so it can step straight over a landing.
- **The first ring comes late.** The loop starts at hydration, and the first landing is one hold and one hop after that (0.85 + 1.05 = 1.9 seconds). A loaded machine delays hydration, and five seconds from `load` left too thin a margin.

## Done when

- [x] The test waits for the animation's own timing rather than a default timeout
- [x] It still asserts that the ring becomes visible after the document lands
- [x] It passes repeatedly under load
- [x] The full suite is green

## Comments

The ring is now watched every animation frame inside the page, the same way the tower-order test beside it watches the document. The wait is the first landing plus one whole round of the loop (1.9 + 6.9 = 8.8 seconds), with the timings copied into the test from `hero-loop.tsx` and a comment saying where they come from. A page that hydrates late, or drops the frames of the first pulse, still has three more landings to show a ring at.

The test also checks what its name already claimed: that the ring appears on the document. The document holds still for longer than the ring is visible, so their centres must match to within half a percent of the art box.

### Verified

All on `TEST_PORT=3150`:

- **Before the fix:** 18 failures in 60 runs, with `--repeat-each=60 --workers=20`.
- **After the fix:** 60 passed in 60 under the same load, and 120 passed in 120 with `--repeat-each=120 --workers=40`.
- **It still catches a broken ring.** With the pulse starting at opacity 0, the test failed with "the pulse ring never appeared". With the ring placed at the tower the document had just left, it failed with "the ring is not where the document landed" (18.6% against 81.3%). Both changes were reverted.
- **Full suite:** 480 passed.
