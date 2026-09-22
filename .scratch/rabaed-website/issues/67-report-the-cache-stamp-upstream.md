# 67: Report the cache stamp upstream

**What is wrong:** Next stamps a cached page with the moment the write finished,
not the moment the render read its data. A render that read before a publish and
wrote after it therefore looks newer than the publish, and Next keeps serving it.
That is ticket 64. Stamping the read instead would close the window for everyone,
and it is not a thing we can do from here — a custom cache handler is ignored on
Vercel.

**Blocked by:** nothing. Independent of whatever ticket 64 decides.

**Status:** ready-for-human — it is a post to a public tracker, so the founder
sends it

- [ ] An issue on `vercel/next.js` describing the stamp, not our symptom
- [ ] The reproduction from ticket 64, cut down so a stranger can run it without
      this repo
- [ ] The issue link recorded in ticket 64, so whoever picks that up later knows
      it is filed

**Not this ticket:** waiting for it. Nothing we do depends on the answer, and
ticket 64 should be decided as if this will never land.
