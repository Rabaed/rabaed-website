/**
 * Leaves preview. A POST, from the form in the preview banner: a GET could be
 * fetched ahead of time by a browser or a link checker and end the preview
 * before the editor asked.
 */
import { draftMode } from 'next/headers';

export async function POST() {
  (await draftMode()).disable();
  return new Response(null, { status: 303, headers: { Location: '/' } });
}
