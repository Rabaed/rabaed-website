import { ARROW_KEYS, type ReadingDirection } from '@/lib/reading-direction';

/**
 * A row of tabs choosing between panels: what a click, the arrow keys and —
 * where a section asks for it — the pointer arriving over a tab each do.
 *
 * The home page's four units and the product page's roles both work this way,
 * and differ only in what "choosing" redraws and whether hovering chooses, so
 * those two things are what a caller supplies.
 *
 * **The arrow keys follow the reading direction**: in Arabic the next tab is
 * to the left. Either end wraps round to the other, and focus moves with the
 * choice.
 *
 * Returns the teardown, which removes every listener this added.
 */
export function listenToTabs(
  tabs: readonly HTMLElement[],
  options: {
    readonly direction: ReadingDirection;
    readonly choose: (index: number) => void;
    readonly chooseOnHover?: boolean;
  },
): () => void {
  const keys = ARROW_KEYS[options.direction];

  const undo = tabs.map((tab, index) => {
    const choose = () => options.choose(index);
    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.key === keys.forward ? 1 : event.key === keys.back ? -1 : 0;
      if (step === 0) return;
      event.preventDefault();
      const next = (index + step + tabs.length) % tabs.length;
      tabs[next].focus();
      options.choose(next);
    };

    tab.addEventListener('click', choose);
    if (options.chooseOnHover) tab.addEventListener('mouseenter', choose);
    tab.addEventListener('keydown', onKeyDown);
    return () => {
      tab.removeEventListener('click', choose);
      tab.removeEventListener('mouseenter', choose);
      tab.removeEventListener('keydown', onKeyDown);
    };
  });

  return () => undo.forEach((remove) => remove());
}
