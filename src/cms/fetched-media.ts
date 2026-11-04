import type { Media, ProfileFile, SharingImage } from '@/payload-types';

/**
 * An upload field's value as a page can draw it: the image — or, for the
 * Company profile's files, the video or PDF (`ProfileFile`) — when it was
 * fetched along with its entry — otherwise the field holds only its id — and
 * `null` when there is none, as in a draft not finished yet.
 */
export function fetchedMedia<Upload extends Media | ProfileFile = Media>(
  value: number | Upload | null | undefined,
): Upload | null {
  return value && typeof value === 'object' ? value : null;
}

/**
 * The picture an entry's link unfurls as, where an Editor has given it one
 * (ticket 26) — read the same way, and from the same one level deep, as any
 * other image an entry names.
 */
export function fetchedSharingImage(
  value: number | SharingImage | null | undefined,
): { url: string; alt: string } | null {
  if (!value || typeof value !== 'object' || !value.url) return null;
  return { url: value.url, alt: value.alt };
}
