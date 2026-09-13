import * as migration_20260913_191345_initial from './20260913_191345_initial';
import * as migration_20260913_191346_publish_contact_points from './20260913_191346_publish_contact_points';
import * as migration_20260913_210719_legal_documents from './20260913_210719_legal_documents';
import * as migration_20260913_210720_import_legal_documents from './20260913_210720_import_legal_documents';

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
    up: migration_20260913_210719_legal_documents.up,
    down: migration_20260913_210719_legal_documents.down,
    name: '20260913_210719_legal_documents',
  },
  {
    up: migration_20260913_210720_import_legal_documents.up,
    down: migration_20260913_210720_import_legal_documents.down,
    name: '20260913_210720_import_legal_documents',
  },
];
