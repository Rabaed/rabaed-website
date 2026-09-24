/**
 * Who the suites sign in as, and how a signed-in request survives the
 * sign-ins beside it (ticket 90).
 *
 * **Every suite has accounts of its own, made from its file name.** Payload
 * records a login by reading the editor's list of sessions, adding one and
 * writing the list back, so two sign-ins to one account in the same instant
 * can erase each other's session — and the request made with the lost one is
 * refused as if nobody were signed in (`cms.spec.ts` tells how that surfaced).
 * An account per suite keeps suites apart; one per worker as well
 * (`parallelIndex`) keeps apart the tests of one suite that run side by side,
 * since a worker runs one test at a time. `home-text.spec.ts` on the third
 * worker signs in as `home-text-2@rabaed.test`.
 *
 * Nobody lists them. The test server creates one account, `KEYHOLDER`
 * (`scripts/test-server.mjs`), and the first sign-in to a suite's account that
 * finds no such account has the keyholder invite it, as an editor invites
 * another from the admin (`src/cms/collections/users.ts`).
 *
 * **A request refused for want of a session is sent again, signed in
 * afresh** (`signedIn`). That covers what one account per worker cannot: a
 * test that sends several requests at once, each finding itself signed out
 * and signing in at the same moment as the others.
 *
 * Loaded by the test server under Node's own TypeScript loading as well as by
 * Playwright, so it imports nothing that needs a bundler to resolve.
 */
import path from 'node:path';
import { expect, request as requests, test, type APIRequestContext, type APIResponse, type TestInfo } from '@playwright/test';

export type Editor = { readonly email: string; readonly password: string };

/** The one account the test server creates, in its throwaway database. It invites every other. */
export const KEYHOLDER: Editor = {
  email: 'keyholder@rabaed.test',
  password: 'test-keyholder-password-90',
};

/** The running suite's account on the running worker. */
export function suiteEditor(info: TestInfo = test.info()): Editor {
  const suite = path.basename(info.file).replace(/\.spec\.ts$/, '');
  const worker = info.parallelIndex;
  return { email: `${suite}-${worker}@rabaed.test`, password: `test-editor-password-${suite}-${worker}` };
}

/**
 * Signs `request` in through the API, as the running suite's editor unless
 * told otherwise — inviting the account first if this is its first sign-in.
 */
export async function signIn(request: APIRequestContext, editor: Editor = suiteEditor()): Promise<void> {
  let response = await request.post('/api/users/login', { data: editor });
  if (response.status() === 401 && editor.email !== KEYHOLDER.email) {
    await invite(editor);
    response = await request.post('/api/users/login', { data: editor });
  }
  expect(response.ok(), `${editor.email} could not sign in: ${await response.text()}`).toBe(true);
}

/**
 * That `editor`'s account exists, for a test that signs in through the admin's
 * form rather than the API: signed in once, in a request context of its own,
 * which invites it if need be.
 */
export async function invited(editor: Editor = suiteEditor()): Promise<void> {
  const context = await requests.newContext({ baseURL: test.info().project.use.baseURL });
  try {
    await signIn(context, editor);
  } finally {
    await context.dispose();
  }
}

/**
 * Has the keyholder create `editor`'s account, in a request context of its
 * own so that the caller's session is not touched. Another request of the
 * same test may have invited it a moment before; the sign-in that follows is
 * what says whether the account is there.
 */
async function invite(editor: Editor): Promise<void> {
  const keyholder = await requests.newContext({ baseURL: test.info().project.use.baseURL });
  try {
    await signedIn(keyholder, KEYHOLDER).post('/api/users', { data: editor });
  } finally {
    await keyholder.dispose();
  }
}

type Options = Parameters<APIRequestContext['fetch']>[1];

/** What a refusal for want of a session looks like, where a 403 is not always one. */
type Refusals = {
  /**
   * A 403 is the server's answer rather than a lost session: a signed
   * document link turned down, which it is whoever asks (`forms.ts`).
   */
  readonly forbiddenIsAnAnswer?: boolean;
};

/**
 * `request`, signed in as `editor`: each request refused as if nobody were
 * signed in — 401, or the 403 Payload's API gives a visitor — is sent again
 * after signing in afresh, up to six times, with a pause that grows so that
 * requests which lost their sessions together do not sign in together again.
 *
 * Signing in first is not needed. A request context with no session is
 * refused like one whose session was lost, and signs in the same way.
 */
export function signedIn(request: APIRequestContext, editor: Editor = suiteEditor()) {
  const send = async (make: () => Promise<APIResponse>, refusals: Refusals = {}): Promise<APIResponse> => {
    for (let attempt = 1; ; attempt++) {
      const response = await make();
      const status = response.status();
      const lostSession = status === 401 || (status === 403 && !refusals.forbiddenIsAnAnswer);
      if (!lostSession || attempt === 6) return response;
      if (attempt > 1) await new Promise((resolve) => setTimeout(resolve, 100 * attempt + Math.random() * 200));
      await signIn(request, editor);
    }
  };
  return {
    get: (address: string, options?: Options, refusals?: Refusals) => send(() => request.get(address, options), refusals),
    post: (address: string, options?: Options, refusals?: Refusals) => send(() => request.post(address, options), refusals),
    delete: (address: string, options?: Options, refusals?: Refusals) => send(() => request.delete(address, options), refusals),
  };
}

export type SignedIn = ReturnType<typeof signedIn>;
