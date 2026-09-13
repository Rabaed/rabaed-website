import { readFile } from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';

/**
 * Reads the paragraphs out of a Word document, so a test can hold a page to
 * the approved `.docx` it was imported from (ticket 17, ADR-0003).
 *
 * A `.docx` is a zip archive whose text is in `word/document.xml`. Reading it
 * here, with Node's own zlib, keeps the proof honest in a way a copy of the
 * text would not: the comparison is against the lawyer's file itself, not
 * against something somebody once extracted from it and could have tidied.
 *
 * Only what the comparison needs: each paragraph's text, and whether Word
 * styles it as a heading — Word numbers its headings itself, so the numbers a
 * page prints before each clause are not in the text.
 */
export type WordParagraph = { readonly text: string; readonly heading: boolean };

export async function readWordParagraphs(file: string): Promise<WordParagraph[]> {
  const xml = unzipEntry(await readFile(file), 'word/document.xml').toString('utf8');

  const paragraphs: WordParagraph[] = [];
  // `<w:p>` or `<w:p …>`, but not `<w:pPr>`, which opens a paragraph's properties.
  for (const [, body] of xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)) {
    const text = [...body.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(([, run]) => decodeXml(run)).join('');
    if (text.trim() === '') continue;
    paragraphs.push({ text, heading: /<w:pStyle w:val="Heading\d"\s*\/>/.test(body) });
  }
  return paragraphs;
}

function decodeXml(text: string): string {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

/**
 * One file out of a zip archive, found through the archive's central directory
 * — the table at its end that says where each file starts and how it was
 * compressed.
 */
function unzipEntry(archive: Buffer, name: string): Buffer {
  const END_OF_DIRECTORY = 0x06054b50;
  const DIRECTORY_ENTRY = 0x02014b50;
  const STORED = 0;
  const DEFLATED = 8;

  let end = archive.length - 22;
  while (end >= 0 && archive.readUInt32LE(end) !== END_OF_DIRECTORY) end--;
  if (end < 0) throw new Error('not a zip archive');

  const entries = archive.readUInt16LE(end + 10);
  let at = archive.readUInt32LE(end + 16);
  for (let i = 0; i < entries; i++) {
    if (archive.readUInt32LE(at) !== DIRECTORY_ENTRY) throw new Error('damaged zip directory');
    const method = archive.readUInt16LE(at + 10);
    const size = archive.readUInt32LE(at + 20);
    const nameLength = archive.readUInt16LE(at + 28);
    const extraLength = archive.readUInt16LE(at + 30);
    const commentLength = archive.readUInt16LE(at + 32);
    const localHeader = archive.readUInt32LE(at + 42);
    const entryName = archive.toString('utf8', at + 46, at + 46 + nameLength);

    if (entryName === name) {
      // The file's own header repeats its name and may carry a different extra field.
      const start = localHeader + 30 + archive.readUInt16LE(localHeader + 26) + archive.readUInt16LE(localHeader + 28);
      const data = archive.subarray(start, start + size);
      if (method === STORED) return data;
      if (method === DEFLATED) return inflateRawSync(data);
      throw new Error(`${name} is compressed a way this reader does not know (${method})`);
    }
    at += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error(`no ${name} in the archive`);
}
