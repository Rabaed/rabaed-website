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
import * as migration_20260915_195429_partnership_page from './20260915_195429_partnership_page';
import * as migration_20260915_195430_import_partnership_page from './20260915_195430_import_partnership_page';
import * as migration_20260915_200327_referral_page_and_program_values from './20260915_200327_referral_page_and_program_values';
import * as migration_20260915_200328_import_referral_page from './20260915_200328_import_referral_page';
import * as migration_20260915_211211_home_page from './20260915_211211_home_page';
import * as migration_20260915_211212_import_home_page from './20260915_211212_import_home_page';
import * as migration_20260920_170916_partnership_application_form from './20260920_170916_partnership_application_form';
import * as migration_20260920_170917_publish_partnership_application_wording from './20260920_170917_publish_partnership_application_wording';
import * as migration_20260920_182913_site_words_and_index_leads from './20260920_182913_site_words_and_index_leads';
import * as migration_20260920_182914_import_site_words_and_index_leads from './20260920_182914_import_site_words_and_index_leads';
import * as migration_20260920_184810_ai_crawler_rules from './20260920_184810_ai_crawler_rules';
import * as migration_20260920_204225_trust_strip from './20260920_204225_trust_strip';
import * as migration_20260920_204226_import_trust_strip from './20260920_204226_import_trust_strip';
import * as migration_20260920_211935_search_settings from './20260920_211935_search_settings';
import * as migration_20260920_211936_import_search_settings from './20260920_211936_import_search_settings';
import * as migration_20260921_035305_tool_download_form from './20260921_035305_tool_download_form';
import * as migration_20260921_035306_publish_tool_download_wording from './20260921_035306_publish_tool_download_wording';
import * as migration_20260921_101500_import_launch_articles from './20260921_101500_import_launch_articles';
import * as migration_20260921_110900_answer_first_openers from './20260921_110900_answer_first_openers';
import * as migration_20260921_111500_propose_answer_first_copy from './20260921_111500_propose_answer_first_copy';
import * as migration_20260923_090000_propose_english_site_words from './20260923_090000_propose_english_site_words';
import * as migration_20260923_120000_english_form_wording from './20260923_120000_english_form_wording';
import * as migration_20260923_120001_propose_english_form_wording from './20260923_120001_propose_english_form_wording';
import * as migration_20260923_120002_propose_english_pages from './20260923_120002_propose_english_pages';

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
    up: migration_20260915_195429_partnership_page.up,
    down: migration_20260915_195429_partnership_page.down,
    name: '20260915_195429_partnership_page',
  },
  {
    up: migration_20260915_195430_import_partnership_page.up,
    down: migration_20260915_195430_import_partnership_page.down,
    name: '20260915_195430_import_partnership_page',
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
  {
    up: migration_20260915_211211_home_page.up,
    down: migration_20260915_211211_home_page.down,
    name: '20260915_211211_home_page',
  },
  {
    up: migration_20260915_211212_import_home_page.up,
    down: migration_20260915_211212_import_home_page.down,
    name: '20260915_211212_import_home_page',
  },
  {
    up: migration_20260920_170916_partnership_application_form.up,
    down: migration_20260920_170916_partnership_application_form.down,
    name: '20260920_170916_partnership_application_form',
  },
  {
    up: migration_20260920_170917_publish_partnership_application_wording.up,
    down: migration_20260920_170917_publish_partnership_application_wording.down,
    name: '20260920_170917_publish_partnership_application_wording',
  },
  {
    up: migration_20260920_182913_site_words_and_index_leads.up,
    down: migration_20260920_182913_site_words_and_index_leads.down,
    name: '20260920_182913_site_words_and_index_leads',
  },
  {
    up: migration_20260920_182914_import_site_words_and_index_leads.up,
    down: migration_20260920_182914_import_site_words_and_index_leads.down,
    name: '20260920_182914_import_site_words_and_index_leads',
  },
  {
    up: migration_20260920_184810_ai_crawler_rules.up,
    down: migration_20260920_184810_ai_crawler_rules.down,
    name: '20260920_184810_ai_crawler_rules',
  },
  {
    up: migration_20260920_204225_trust_strip.up,
    down: migration_20260920_204225_trust_strip.down,
    name: '20260920_204225_trust_strip',
  },
  {
    up: migration_20260920_204226_import_trust_strip.up,
    down: migration_20260920_204226_import_trust_strip.down,
    name: '20260920_204226_import_trust_strip',
  },
  {
    up: migration_20260920_211935_search_settings.up,
    down: migration_20260920_211935_search_settings.down,
    name: '20260920_211935_search_settings',
  },
  {
    up: migration_20260920_211936_import_search_settings.up,
    down: migration_20260920_211936_import_search_settings.down,
    name: '20260920_211936_import_search_settings',
  },
  {
    up: migration_20260921_035305_tool_download_form.up,
    down: migration_20260921_035305_tool_download_form.down,
    name: '20260921_035305_tool_download_form',
  },
  {
    up: migration_20260921_035306_publish_tool_download_wording.up,
    down: migration_20260921_035306_publish_tool_download_wording.down,
    name: '20260921_035306_publish_tool_download_wording',
  },
  {
    up: migration_20260921_101500_import_launch_articles.up,
    down: migration_20260921_101500_import_launch_articles.down,
    name: '20260921_101500_import_launch_articles',
  },
  {
    up: migration_20260921_110900_answer_first_openers.up,
    down: migration_20260921_110900_answer_first_openers.down,
    name: '20260921_110900_answer_first_openers',
  },
  {
    up: migration_20260921_111500_propose_answer_first_copy.up,
    down: migration_20260921_111500_propose_answer_first_copy.down,
    name: '20260921_111500_propose_answer_first_copy',
  },
  {
    up: migration_20260923_090000_propose_english_site_words.up,
    down: migration_20260923_090000_propose_english_site_words.down,
    name: '20260923_090000_propose_english_site_words',
  },
  {
    up: migration_20260923_120000_english_form_wording.up,
    down: migration_20260923_120000_english_form_wording.down,
    name: '20260923_120000_english_form_wording',
  },
  {
    up: migration_20260923_120001_propose_english_form_wording.up,
    down: migration_20260923_120001_propose_english_form_wording.down,
    name: '20260923_120001_propose_english_form_wording',
  },
  {
    up: migration_20260923_120002_propose_english_pages.up,
    down: migration_20260923_120002_propose_english_pages.down,
    name: '20260923_120002_propose_english_pages',
  },
];
