import type { FormDefinition, FormId } from './definition';
import { DEMO_REQUEST } from './demo-request';
import { PARTNERSHIP_APPLICATION } from './partnership-application';
import { REFERRAL_SIGNUP } from './referral-signup';
import { TOOL_DOWNLOAD } from './tool-download';

/** Every form definition, by id. */
export const FORMS: Readonly<Record<FormId, FormDefinition>> = {
  'demo-request': DEMO_REQUEST,
  'referral-signup': REFERRAL_SIGNUP,
  'tool-download': TOOL_DOWNLOAD,
  'partnership-application': PARTNERSHIP_APPLICATION,
};

/**
 * The forms that send through the submission pipeline, each with its wording
 * and alert address in the CMS. A form joins by being added here, with a
 * migration for its settings.
 */
export const SUBMITTABLE_FORMS: readonly FormDefinition[] = [
  DEMO_REQUEST,
  REFERRAL_SIGNUP,
  TOOL_DOWNLOAD,
  PARTNERSHIP_APPLICATION,
];
