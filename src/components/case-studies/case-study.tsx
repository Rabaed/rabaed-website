import { RichText } from '@payloadcms/richtext-lexical/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  EditorialFrame,
  EditorialHero,
  MediaImage,
  OtherLanguageNotice,
  otherLanguageMetadata,
  PublishedDate,
} from '@/components/editorial';
import { allPublishedCaseStudies, publishedCaseStudyLocales, findCaseStudy, hasPublishedCaseStudies } from '@/cms/case-studies';
import { fetchedMedia, fetchedSharingImage } from '@/cms/fetched-media';
import { CASE_STUDIES_COPY } from '@/content/case-studies';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { localePath, type Locale } from '@/lib/locales';
import { breadcrumbData, StructuredData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/metadata';
import type { CaseStudy } from '@/payload-types';

/**
 * The case studies published in a language when the site is built. One
 * published later is built on its first visit, and publishing marks the pages
 * stale (`src/cms/editorial-fields.ts`).
 */
export async function caseStudyParams(locale: Locale): Promise<{ slug: string }[]> {
  return (await allPublishedCaseStudies(locale)).map((caseStudy) => ({ slug: caseStudy.slug }));
}

/** A case study's title, its summary as the description, and an alternate for each language it is published in. */
export async function caseStudyMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const copy = CASE_STUDIES_COPY[locale];
  const caseStudy = await findCaseStudy(locale, slug);
  if (!caseStudy) return otherLanguageMetadata(copy.metaTitle);

  return pageMetadata({
    locale,
    locales: await publishedCaseStudyLocales(slug),
    path: caseStudyPath(slug),
    title: `${caseStudy.title} · ${copy.siteName}`,
    description: caseStudy.summary,
    sharingImage: fetchedSharingImage(caseStudy.sharingImage),
  });
}

/**
 * A case study (ticket 24): the hero with its title, client and sector, then
 * on the pale ground the cover, the answer-first opening paragraph, the
 * figures, and the story in three parts — the challenge, what changed, the
 * outcome — with the client's quote before the outcome and further images
 * after it.
 *
 * Figures and a quote appear only when the case study has them. Nothing
 * stands in for either: no empty heading, no sample number (spec: SEO and GEO).
 *
 * A server component: every word is in the first response (ADR-0001). A case
 * study missing in this language is handled as an article is
 * (`src/components/blog/blog-post.tsx`).
 */
export async function CaseStudyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const copy = CASE_STUDIES_COPY[locale];
  const caseStudy = await findCaseStudy(locale, slug);
  // A draft previewed before anything is published has no index to go back to.
  const indexHref = (await hasPublishedCaseStudies(locale)) ? localePath(locale, CASE_STUDIES_PATH) : undefined;

  if (!caseStudy) {
    const available = (await publishedCaseStudyLocales(slug)).find((code) => code !== locale);
    if (!available) notFound();

    return (
      <OtherLanguageNotice
        locale={locale}
        path={CASE_STUDIES_PATH}
        eyebrow={copy.eyebrow}
        indexHref={indexHref}
        notice={copy.untranslated}
        linkLabel={copy.otherLanguage}
        available={available}
        href={localePath(available, caseStudyPath(slug))}
      />
    );
  }

  // A draft being previewed may not have everything yet; a published case study does.
  const cover = fetchedMedia(caseStudy.coverImage);
  const images = (caseStudy.images ?? []).flatMap((image) => fetchedMedia(image) ?? []);
  const figures = caseStudy.figures ?? [];
  const quote = caseStudy.quote?.text?.trim() ? caseStudy.quote : null;

  return (
    <EditorialFrame locale={locale} path={CASE_STUDIES_PATH}>
      <EditorialHero eyebrow={copy.eyebrow} indexHref={indexHref} title={caseStudy.title}>
        <dl className="case-facts">
          {caseStudy.client && (
            <div>
              <dt>{copy.client}</dt>
              <dd>{caseStudy.client}</dd>
            </div>
          )}
          {caseStudy.sector && (
            <div>
              <dt>{copy.sector}</dt>
              <dd>{caseStudy.sector}</dd>
            </div>
          )}
        </dl>
        <div className="entry-meta">
          {caseStudy.author && <span>{`${copy.by} ${caseStudy.author}`}</span>}
          {caseStudy.publishedAt && <PublishedDate locale={locale} date={caseStudy.publishedAt} />}
        </div>
      </EditorialHero>

      <section className="light entry">
        <article className="wrap">
          {cover && <MediaImage className="cover" image={cover} sizes="(max-width: 884px) 100vw, 820px" />}
          {caseStudy.answer && <p className="answer">{caseStudy.answer}</p>}

          {figures.length > 0 && (
            <section className="case-figures" aria-labelledby="case-figures">
              <h2 id="case-figures">{copy.figures}</h2>
              <ul>
                {figures.map((figure, index) => (
                  <li key={figure.id ?? index}>
                    <b>{figure.value}</b>
                    <span>{figure.label}</span>
                    <small>{figure.basis}</small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <StoryPart title={copy.challenge} text={caseStudy.challenge} />
          <StoryPart title={copy.whatChanged} text={caseStudy.whatChanged} />

          {quote && (
            <figure className="case-quote">
              <blockquote>{quote.text}</blockquote>
              {quote.name && <figcaption>{[quote.name, quote.role].filter(Boolean).join(' — ')}</figcaption>}
            </figure>
          )}

          <StoryPart title={copy.outcome} text={caseStudy.outcome} />

          {images.length > 0 && (
            <section className="case-images" aria-label={copy.images}>
              {images.map((image) => (
                <MediaImage key={image.id} image={image} sizes="(max-width: 640px) 100vw, 410px" lazy />
              ))}
            </section>
          )}
        </article>
      </section>
      <StructuredData
        data={await breadcrumbData(locale, [
          { name: copy.eyebrow, path: CASE_STUDIES_PATH },
          { name: caseStudy.title, path: caseStudyPath(slug) },
        ])}
      />
    </EditorialFrame>
  );
}

function StoryPart({ title, text }: { title: string; text: CaseStudy['challenge'] | null | undefined }) {
  if (!text) return null;
  return (
    <section className="case-part">
      <h2>{title}</h2>
      <RichText className="entry-body" data={text} />
    </section>
  );
}
