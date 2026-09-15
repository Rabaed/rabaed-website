/**
 * Payload CMS, mounted inside the site's own Next.js application (spec: Stack
 * and hosting). Content lives in Supabase Postgres and images in Supabase
 * Storage (ADR-0004).
 *
 * Imports in the CMS are relative rather than through `@/`: this file is also
 * loaded by Payload's command line, outside Next's bundler.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { ar } from '@payloadcms/translations/languages/ar';
import { en } from '@payloadcms/translations/languages/en';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { CaseStudies } from './cms/collections/case-studies';
import { Faqs } from './cms/collections/faq-entries';
import { FormSubmissions } from './cms/collections/form-submissions';
import { LegalDocuments } from './cms/collections/legal-documents';
import { Media } from './cms/collections/media';
import { Posts } from './cms/collections/posts';
import { Users } from './cms/collections/users';
import { databaseUrl, mediaBucket, payloadSecret, requireDeploymentVariables } from './cms/environment';
import { formSettingsGlobal } from './cms/globals/form-settings';
import { SiteSettings } from './cms/globals/site-settings';
import { ClosingSection } from './cms/globals/closing-section';
import { ProductPage } from './cms/globals/product-page';
import { ScreenMocks } from './cms/globals/screen-mocks';
import { StartPage } from './cms/globals/start-page';
import { SUBMITTABLE_FORMS } from './forms/registry';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Where the admin lives. Not `/admin`, which every scanner on the internet
 * tries first — though that is only noise reduction: what keeps people out is
 * that there are no accounts to sign up for (`cms/collections/users.ts`).
 *
 * The route folder `src/app/(payload)/maktab/` has to carry the same name.
 */
export const ADMIN_ROUTE = '/maktab';

// Before anything reads a variable, so a deployment missing several is told
// about all of them in one failed build.
requireDeploymentVariables();
const bucket = mediaBucket();

export default buildConfig({
  secret: payloadSecret(),
  telemetry: false,

  routes: { admin: ADMIN_ROUTE, api: '/api' },

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — ربائد',
      robots: 'noindex, nofollow',
    },
    importMap: {
      baseDir: dirname,
      importMapFile: path.resolve(dirname, 'app', '(payload)', 'maktab', 'importMap.js'),
    },
  },

  // Arabic first: it is what the admin opens in unless an editor chooses
  // English (spec: user story 42).
  i18n: {
    supportedLanguages: { ar, en },
    fallbackLanguage: 'ar',
  },

  // No `localization`: page text holds its Arabic and English side by side in
  // fields of its own (`cms/page-fields.ts` says why).
  collections: [Users, Media, Posts, CaseStudies, LegalDocuments, Faqs, FormSubmissions],
  // One settings global per form that submits (ticket 27), and one entry per
  // marketing page whose words are in the CMS (ticket 53), with the closing
  // section and the Screen mocks the pages share (ticket 57).
  globals: [
    SiteSettings,
    ...SUBMITTABLE_FORMS.map(formSettingsGlobal),
    StartPage,
    ProductPage,
    ClosingSection,
    ScreenMocks,
  ],

  db: postgresAdapter({
    pool: { connectionString: databaseUrl() },
    // Migrations everywhere, including development, so that the schema a
    // developer builds against is the schema production gets.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  sharp,

  upload: {
    limits: { fileSize: 10 * 1024 * 1024 },
  },

  plugins: [
    s3Storage({
      enabled: bucket !== null,
      collections: { media: true },
      bucket: bucket?.bucket ?? '',
      config: {
        endpoint: bucket?.endpoint,
        region: bucket?.region,
        // Supabase Storage answers S3 requests by path, not by subdomain.
        forcePathStyle: true,
        credentials: bucket
          ? { accessKeyId: bucket.accessKeyId, secretAccessKey: bucket.secretAccessKey }
          : undefined,
      },
    }),
  ],

  // Nothing on the site uses GraphQL; switched off, it is one less public
  // endpoint to keep safe.
  graphQL: { disable: true },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
