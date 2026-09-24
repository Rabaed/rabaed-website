/**
 * The demo request form reached without a browser: a request sent straight to
 * the server, and the form's settings as its editor reads and publishes them.
 * Shared by the form suite and the confirmation limit's suite, which run
 * against different servers (`playwright.config.ts`).
 */
import { randomUUID } from 'node:crypto';
import { expect, type APIRequestContext } from '@playwright/test';
import { FORM_EDITOR, logInByApi } from './cms';
import { APPLICANT } from './forms';
import { TRAP_FIELD } from '../../src/forms/definition';

const SETTINGS = '/api/globals/demo-request-form';

export type DemoSettings = Record<string, unknown> & {
  alertAddress?: string | null;
  confirmationSubject: string;
  fields: { company: { placeholder: string } };
};

/**
 * A valid demo request sent straight to the server, as a script would send it
 * rather than a person at the form: its answer, and nothing waited for.
 */
export async function postDemoRequest(
  request: APIRequestContext,
  baseURL: string,
  applicant: { email: string; ip: string; name?: string; locale?: 'en' },
): Promise<{ outcome: string }> {
  const response = await request.post(`/api/forms/demo-request${applicant.locale ? `?locale=${applicant.locale}` : ''}`, {
    headers: { origin: baseURL, 'x-forwarded-for': applicant.ip },
    multipart: {
      name: applicant.name ?? APPLICANT.name,
      email: applicant.email,
      role: 'owner',
      phone: APPLICANT.phone,
      submissionToken: randomUUID(),
      [TRAP_FIELD]: '',
    },
  });
  expect(response.ok(), await response.text()).toBe(true);
  return response.json();
}

/** The demo request form's settings as they are published, ready to publish again. */
export async function readDemoSettings(request: APIRequestContext): Promise<DemoSettings> {
  const response = await request.get(`${SETTINGS}?depth=0`);
  expect(response.ok()).toBe(true);
  const { id, globalType, createdAt, updatedAt, ...settings } = await response.json();
  return settings;
}

/**
 * Publishes the settings as the form editor. A sign-in to that editor
 * elsewhere in the run can erase this one's session (`cms.ts`), and the
 * publish is then refused as if nobody were signed in: so it is signed in
 * afresh and asked again, as `readerGet` does.
 */
export async function publishDemoSettings(request: APIRequestContext, settings: DemoSettings): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    const response = await request.post(SETTINGS, { data: { ...settings, _status: 'published' } });
    const lostSession = response.status() === 401 || response.status() === 403;
    if (!lostSession || attempt === 3) {
      expect(response.ok(), await response.text()).toBe(true);
      return;
    }
    await logInByApi(request, FORM_EDITOR);
  }
}
