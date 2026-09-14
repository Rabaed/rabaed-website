import * as migration_20260913_191345_initial from './20260913_191345_initial';
import * as migration_20260913_191346_publish_contact_points from './20260913_191346_publish_contact_points';
import * as migration_20260913_210524_blog_posts from './20260913_210524_blog_posts';
import * as migration_20260914_061634_legal_documents from './20260914_061634_legal_documents';
import * as migration_20260914_061635_import_legal_documents from './20260914_061635_import_legal_documents';
import * as migration_20260914_193519_faq_entries from './20260914_193519_faq_entries';
import * as migration_20260914_193520_import_faq_entries from './20260914_193520_import_faq_entries';

export const migrations = [
  {
    up: migration_20260913_191345_initial.up,
    down: migration_20260913_191345_initial.down,
    name: '20260913_191345_initial',
  },
  {
    up: migration_20260913_191346_publish_contact_points.up,
    down: migration_20260913_191346_publish_contact_points.down,
    name: '20260913_191346_publish_contact_points',
  },
  {
    up: migration_20260913_210524_blog_posts.up,
    down: migration_20260913_210524_blog_posts.down,
    name: '20260913_210524_blog_posts',
  },
  {
    up: migration_20260914_061634_legal_documents.up,
    down: migration_20260914_061634_legal_documents.down,
    name: '20260914_061634_legal_documents',
  },
  {
    up: migration_20260914_061635_import_legal_documents.up,
    down: migration_20260914_061635_import_legal_documents.down,
    name: '20260914_061635_import_legal_documents',
  },
  {
    up: migration_20260914_193519_faq_entries.up,
    down: migration_20260914_193519_faq_entries.down,
    name: '20260914_193519_faq_entries',
  },
  {
    up: migration_20260914_193520_import_faq_entries.up,
    down: migration_20260914_193520_import_faq_entries.down,
    name: '20260914_193520_import_faq_entries',
  },
];
