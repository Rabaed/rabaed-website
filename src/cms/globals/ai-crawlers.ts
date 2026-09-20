import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { refreshSiteWhenSaved } from '../revalidation';

/**
 * The one decision about AI crawlers that is Ahmed's rather than a
 * developer's: whether the crawlers that collect pages to train a model may
 * read the site (ticket 33). `src/app/robots.ts` writes the answer into
 * `robots.txt`; the crawlers that fetch a page to answer a question and cite
 * the source are allowed there unconditionally, and nothing here can refuse
 * them.
 *
 * No drafts, unlike every other global. A draft is for words a page will show,
 * previewed before visitors see them; this is a policy with no page to preview
 * and no half-state worth keeping, so ticking the box and saving is the whole
 * act — the "single switch" the ticket asks for.
 */
export const AiCrawlers: GlobalConfig = {
  slug: 'ai-crawlers',
  label: { ar: 'زواحف الذكاء الاصطناعي', en: 'AI crawlers' },
  access: {
    read: signedIn,
    update: signedIn,
  },
  // `robots.txt` is built ahead of time like every page, so it has to be
  // marked stale when this changes (`src/cms/revalidation.ts`).
  hooks: {
    afterChange: [refreshSiteWhenSaved],
  },
  fields: [
    {
      name: 'allowTraining',
      type: 'checkbox',
      defaultValue: true,
      label: { ar: 'السماح لزواحف التدريب', en: 'Allow training crawlers' },
      admin: {
        description: {
          ar:
            'زواحف التدريب — GPTBot وClaudeBot وCCBot وMeta-ExternalAgent — تنسخ صفحات الموقع لتدريب نماذج الذكاء الاصطناعي. ' +
            'السماح لها يجعل النماذج تعرف ربائد من داخلها بعد سنة أو سنتين، بلا استشهاد ولا زيارة ولا رابط؛ ومنعها يحفظ ' +
            'المحتوى من النسخ ولا ينقص ظهور ربائد اليوم، لأن زواحف الاسترجاع والاستشهاد — التي تفتح الصفحة لحظة سؤال ' +
            'المستخدم وتذكر المصدر — مسموح لها دائماً ولا يمسّها هذا الخيار. الوضع الافتراضي: مسموح.',
          en:
            'Training crawlers — GPTBot, ClaudeBot, CCBot and Meta-ExternalAgent — copy the site to train AI models. ' +
            'Allowing them makes the models themselves know Rabaed in a year or two, with no citation, visit or link; ' +
            'refusing them keeps the writing from being copied and costs nothing today, because the retrieval and ' +
            'citation crawlers — the ones that fetch a page at the moment somebody asks, and name the source — are ' +
            'always allowed and this switch does not touch them. Allowed by default.',
        },
      },
    },
  ],
};
