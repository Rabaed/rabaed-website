import { Forbidden, type CollectionConfig } from 'payload';
import { signedIn } from '../access';

/**
 * Set on `context` by `scripts/create-editor.ts`, the one way to create an
 * account without being signed in as an editor already.
 */
export const CREATED_FROM_COMMAND_LINE = 'createdFromCommandLine';

/**
 * The people who edit the site. Invitation only: an account is created by an
 * editor who already has one, or from the command line by someone holding the
 * database credentials. Nobody can sign themselves up.
 *
 * Access rules alone do not achieve that. While the table is empty, Payload
 * offers a "create first user" form to whoever finds the admin, and that
 * operation skips access rules by design. On a fresh production database the
 * first person to reach the admin path would own the site. The hook below
 * closes it: a create with nobody signed in is refused unless it came from the
 * command line, so the first account is made with `npm run cms:create-editor`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { ar: 'محرّر', en: 'Editor' },
    plural: { ar: 'المحرّرون', en: 'Editors' },
  },
  auth: {
    // Enough for a mistyped password or two, not enough to guess one.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    // A working day.
    tokenExpiration: 8 * 60 * 60,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name'],
  },
  access: {
    read: signedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if (operation === 'create' && !req.user && !req.context[CREATED_FROM_COMMAND_LINE]) {
          throw new Forbidden(req.t);
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { ar: 'الاسم', en: 'Name' },
    },
  ],
};
