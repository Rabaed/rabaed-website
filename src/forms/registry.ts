import type { FormDefinition, FormId } from './definition';
import { DEMO_REQUEST } from './demo-request';
import { REFERRAL_SIGNUP } from './referral-signup';
import { TOOL_DOWNLOAD } from './tool-download';

/** Every form definition, by id. */
export const FORMS: Readonly<Record<FormId, FormDefinition>> = {
  'demo-request': DEMO_REQUEST,
  'referral-signup': REFERRAL_SIGNUP,
  'tool-download': TOOL_DOWNLOAD,
};

/**
 * The forms that send through the submission pipeline, each with its wording
 * and alert address in the CMS. A form joins by being added here — tickets 29
 * and 30 add theirs — with a migration for its settings.
 */
export const SUBMITTABLE_FORMS: readonly FormDefinition[] = [DEMO_REQUEST, REFERRAL_SIGNUP];
