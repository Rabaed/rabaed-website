/**
 * Creates an editor account from the command line — the way the very first
 * account is made, since nobody can sign up through the admin
 * (`src/cms/collections/users.ts`). Later accounts are invited from inside the
 * admin by an editor who already has one.
 *
 *   npm run cms:create-editor -- ahmed@rabaedapp.com
 *
 * Run it with the target environment's `DATABASE_URL` and `PAYLOAD_SECRET`
 * set. With no `EDITOR_PASSWORD` a strong one is generated and printed once;
 * hand it over privately and ask for it to be changed on first sign-in.
 */
import { randomBytes } from 'node:crypto';
import { getPayload } from 'payload';
import { CREATED_FROM_COMMAND_LINE } from '../src/cms/collections/users';
import config from '../src/payload.config';

const email = process.env.EDITOR_EMAIL ?? process.argv[2];
if (!email) {
  console.error('Usage: npm run cms:create-editor -- <email>');
  process.exit(1);
}

const password = process.env.EDITOR_PASSWORD ?? randomBytes(18).toString('base64url');

const payload = await getPayload({ config });
await payload.create({
  collection: 'users',
  data: { email, password },
  context: { [CREATED_FROM_COMMAND_LINE]: true },
});

console.log(`Editor account created for ${email}.`);
if (!process.env.EDITOR_PASSWORD) console.log(`Temporary password: ${password}`);
process.exit(0);
