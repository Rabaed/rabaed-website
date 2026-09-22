/**
 * The site's contact points, as the site carried them before the CMS existed:
 * the words `20260913_191346_publish_contact_points` publishes as the site
 * settings' first version.
 *
 * **Frozen.** This is data for the migration that imports it, and a migration
 * must do the same thing on every database it ever runs on. The site does not
 * read this file: it reads the CMS, where Editors change them from here on.
 * Changing a word here changes nothing anyone sees.
 *
 * Lifted out of the migration verbatim by ticket 68, so that the words stay
 * readable beside the SQL that now writes them (`seed.ts`), and so that the
 * data-migrations test can hold the one to the other.
 */

export const CONTACT_POINTS = {
  whatsappNumber: '966576767900',
  email: 'ahmed.s@rabaedapp.com',
  phone: '+966576767900',
};
