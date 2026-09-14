import type { Media } from '@/payload-types';

/**
 * An image field's value as a page can draw it: the image, when it was fetched
 * along with its entry — otherwise the field holds only its id — and `null`
 * when there is none, as in a draft not finished yet.
 */
export function fetchedMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null;
}
