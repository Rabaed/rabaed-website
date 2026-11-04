import type { CSSProperties } from 'react';

/**
 * One of Ahmed's icons (`public/profile/icons/`), drawn as a mask in the
 * colour of the text around it, so a section's own ink colours it. Artwork,
 * never words: hidden from screen readers.
 */
export function Glyph({ file, className }: { file: string; className?: string }) {
  const style = { '--pf-glyph': `url(/profile/icons/${file})` } as CSSProperties;
  return <span className={className ? `pf-glyph ${className}` : 'pf-glyph'} style={style} aria-hidden="true" />;
}
