import * as migration_20260913_191345_initial from './20260913_191345_initial';
import * as migration_20260913_191346_publish_contact_points from './20260913_191346_publish_contact_points';
import * as migration_20260913_210524_blog_posts from './20260913_210524_blog_posts';
import * as migration_20260914_061634_legal_documents from './20260914_061634_legal_documents';
import * as migration_20260914_061635_import_legal_documents from './20260914_061635_import_legal_documents';
import * as migration_20260914_193519_faq_entries from './20260914_193519_faq_entries';
import * as migration_20260914_193520_import_faq_entries from './20260914_193520_import_faq_entries';
import * as migration_20260914_194143_form_foundation from './20260914_194143_form_foundation';
import * as migration_20260914_194144_publish_demo_request_wording from './20260914_194144_publish_demo_request_wording';
import * as migration_20260914_212631_case_studies from './20260914_212631_case_studies';
import * as migration_20260914_215019_form_settings_snapshot from './20260914_215019_form_settings_snapshot';
import * as migration_20260914_222808_referral_signup_documents from './20260914_222808_referral_signup_documents';
import * as migration_20260914_222809_publish_referral_signup_wording from './20260914_222809_publish_referral_signup_wording';
import * as migration_20260915_040104_start_page from './20260915_040104_start_page';
import * as migration_20260915_040105_import_start_page from './20260915_040105_import_start_page';
import * as migration_20260915_062734_referral_documents_snapshot from './20260915_062734_referral_documents_snapshot';
import * as migration_20260915_063743_product_page_closing_section_and_screen_mocks from './20260915_063743_product_page_closing_section_and_screen_mocks';
import * as migration_20260915_063744_import_product_page_closing_section_and_screen_mocks from './20260915_063744_import_product_page_closing_section_and_screen_mocks';
import * as migration_20260915_064014_tool_page from './20260915_064014_tool_page';
import * as migration_20260915_064015_import_tool_page from './20260915_064015_import_tool_page';
import * as migration_20260915_200327_referral_page_and_program_values from './20260915_200327_referral_page_and_program_values';
import * as migration_20260915_200328_import_referral_page from './20260915_200328_import_referral_page';

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
  {
    up: migration_20260914_194143_form_foundation.up,
    down: migration_20260914_194143_form_foundation.down,
    name: '20260914_194143_form_foundation',
  },
  {
    up: migration_20260914_194144_publish_demo_request_wording.up,
    down: migration_20260914_194144_publish_demo_request_wording.down,
    name: '20260914_194144_publish_demo_request_wording',
  },
  {
    up: migration_20260914_212631_case_studies.up,
    down: migration_20260914_212631_case_studies.down,
    name: '20260914_212631_case_studies',
  },
  {
    up: migration_20260914_215019_form_settings_snapshot.up,
    down: migration_20260914_215019_form_settings_snapshot.down,
    name: '20260914_215019_form_settings_snapshot',
  },
  {
    up: migration_20260914_222808_referral_signup_documents.up,
    down: migration_20260914_222808_referral_signup_documents.down,
    name: '20260914_222808_referral_signup_documents',
  },
  {
    up: migration_20260914_222809_publish_referral_signup_wording.up,
    down: migration_20260914_222809_publish_referral_signup_wording.down,
    name: '20260914_222809_publish_referral_signup_wording',
  },
  {
    up: migration_20260915_040104_start_page.up,
    down: migration_20260915_040104_start_page.down,
    name: '20260915_040104_start_page',
  },
  {
    up: migration_20260915_040105_import_start_page.up,
    down: migration_20260915_040105_import_start_page.down,
    name: '20260915_040105_import_start_page',
  },
  {
    up: migration_20260915_062734_referral_documents_snapshot.up,
    down: migration_20260915_062734_referral_documents_snapshot.down,
    name: '20260915_062734_referral_documents_snapshot',
  },
  {
    up: migration_20260915_063743_product_page_closing_section_and_screen_mocks.up,
    down: migration_20260915_063743_product_page_closing_section_and_screen_mocks.down,
    name: '20260915_063743_product_page_closing_section_and_screen_mocks',
  },
  {
    up: migration_20260915_063744_import_product_page_closing_section_and_screen_mocks.up,
    down: migration_20260915_063744_import_product_page_closing_section_and_screen_mocks.down,
    name: '20260915_063744_import_product_page_closing_section_and_screen_mocks',
  },
  {
    up: migration_20260915_064014_tool_page.up,
    down: migration_20260915_064014_tool_page.down,
    name: '20260915_064014_tool_page',
  },
  {
    up: migration_20260915_064015_import_tool_page.up,
    down: migration_20260915_064015_import_tool_page.down,
    name: '20260915_064015_import_tool_page',
  },
  {
    up: migration_20260915_200327_referral_page_and_program_values.up,
    down: migration_20260915_200327_referral_page_and_program_values.down,
    name: '20260915_200327_referral_page_and_program_values',
  },
  {
    up: migration_20260915_200328_import_referral_page.up,
    down: migration_20260915_200328_import_referral_page.down,
    name: '20260915_200328_import_referral_page',
  },
];
