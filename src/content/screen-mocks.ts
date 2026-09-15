import { fetchedMedia } from '@/cms/fetched-media';
import { pageEntry, wordsIn } from '@/cms/pages';
import { screenMockFieldName } from '@/cms/screen-mock-fields';
import type { ScreenMockPictureContent } from '@/components/screen-mock-picture';
import type { Locale } from '@/lib/locales';
import type { ScreenMock as ScreenMocksEntry } from '@/payload-types';

/** One mock's fields in the CMS's Screen mocks entry: its replacement picture, and its description. */
type MockFields = ScreenMocksEntry['correspondence'];

/**
 * The Screen mocks as the site shows them in `locale` (ticket 57): for a mock's
 * id, what it shows in words — the picture's description and the caption under
 * it (ADR-0002) — and the picture an Editor put in place of its exported image,
 * if any. One entry for every page, so the home and product pages cannot show a
 * mock two ways; a page names the mock, and this says how it looks.
 *
 * A refusal, where the mocks are not published in `locale` (`src/cms/pages.ts`).
 */
export async function getScreenMocks(locale: Locale): Promise<(mock: string) => ScreenMockPictureContent> {
  const entry = await pageEntry('screen-mocks', locale);
  const fieldsOf = entry as unknown as Readonly<Record<string, MockFields | undefined>>;

  return (mock) => {
    const fields = fieldsOf[screenMockFieldName(mock)];
    if (!fields) throw new Error(`No Screen mock called "${mock}" in the CMS's Screen mocks entry`);
    return {
      mock,
      description: wordsIn(locale, fields.description),
      replacement: fetchedMedia(fields.picture),
    };
  };
}
