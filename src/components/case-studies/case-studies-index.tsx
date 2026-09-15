import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorialFrame, EditorialHero, MediaImage, PublishedDate } from '@/components/editorial';
import { hasPublishedCaseStudies, publishedCaseStudies } from '@/cms/case-studies';
import { fetchedMedia } from '@/cms/fetched-media';
import { CASE_STUDIES_COPY } from '@/content/case-studies';
import { CASE_STUDIES_PATH, caseStudyPath } from '@/lib/case-study-paths';
import { LOCALE_CODES, localePath, type Locale } from '@/lib/locales';
import { breadcrumbData, StructuredData } from '@/components/structured-data';
import { pageMetadata } from '@/lib/metadata';
import type { CaseStudy } from '@/payload-types';

/** The index's title and description, with an alternate for each language whose section is showing. */
export async function caseStudiesIndexMetadata(locale: Locale): Promise<Metadata> {
  const copy = CASE_STUDIES_COPY[locale];
  // One argument each, as the header asks, so the per-request cache answers both.
  const showing = await Promise.all(LOCALE_CODES.map((code) => hasPublishedCaseStudies(code)));
  return pageMetadata({
    locale,
    locales: LOCALE_CODES.filter((_, index) => showing[index]),
    path: CASE_STUDIES_PATH,
    title: copy.metaTitle,
    description: copy.lead,
  });
}

/**
 * The case studies index (ticket 24): a language's published case studies,
 * newest first. With none published there is no section to show, so the
 * address is not found — never an empty page (spec: Content model).
 */
export async function CaseStudiesIndexPage({ locale }: { locale: Locale }) {
  const copy = CASE_STUDIES_COPY[locale];
  const caseStudies = await publishedCaseStudies(locale);
  if (caseStudies.length === 0) notFound();

  return (
    <EditorialFrame locale={locale} path={CASE_STUDIES_PATH}>
      <EditorialHero eyebrow={copy.eyebrow} title={copy.title}>
        <p className="lead">{copy.lead}</p>
      </EditorialHero>

      <section className="light entry-list">
        <div className="wrap">
          <div className="entry-grid">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} locale={locale} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      </section>
      <StructuredData data={breadcrumbData(locale, [{ name: copy.eyebrow, path: CASE_STUDIES_PATH }])} />
    </EditorialFrame>
  );
}

function CaseStudyCard({ locale, caseStudy }: { locale: Locale; caseStudy: CaseStudy }) {
  const href = localePath(locale, caseStudyPath(caseStudy.slug));
  const image = fetchedMedia(caseStudy.coverImage);

  return (
    <article className="entry-card">
      {image && (
        // The title below links to the same place; this one is for the pointer, not the keyboard.
        <a href={href} tabIndex={-1} aria-hidden="true">
          <MediaImage image={image} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 372px" decorative />
        </a>
      )}
      <div className="entry-card-text">
        <PublishedDate locale={locale} date={caseStudy.publishedAt} />
        <h2>
          <a href={href}>{caseStudy.title}</a>
        </h2>
        <p className="case-card-client">{`${caseStudy.client} · ${caseStudy.sector}`}</p>
        <p>{caseStudy.summary}</p>
      </div>
    </article>
  );
}
