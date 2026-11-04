/**
 * An item's place in its list, «01», «02», for a list whose order is the
 * point: why Rabaed's three reasons, how we start's three steps (ticket 109).
 * In DM Mono, whose numerals it is.
 */
export function Place({ index }: { index: number }) {
  return <span className="pf-place">{String(index + 1).padStart(2, '0')}</span>;
}
