/**
 * The header and footer's destinations, declared once.
 *
 * On the Reference site this table existed nine times over, as markup, so a
 * new link meant editing nine files and a missed one meant a page whose menu
 * disagreed with the rest of the site. Ticket 21 moves this into the CMS so
 * Ahmed can change it himself; until then it is here.
 *
 * The paths are the site's real routes. Most of the pages behind them arrive
 * in tickets 12–17, so following one before then reaches the 404 page — the
 * ordinary state of a site being built in order.
 */

type NavLink = {
  /** Route path in the Arabic locale, which `localePath` prefixes for others. */
  readonly path: string;
  readonly label: string;
};

type NavGroup = NavLink & {
  /** The line under the entry in the desktop dropdown. */
  readonly summary: string;
};

export const PRIMARY_LINKS: readonly NavLink[] = [
  { path: '/', label: 'الرئيسية' },
  { path: '/product', label: 'المنتج' },
  { path: '/start', label: 'ابدأ' },
];

/** The Partnerships dropdown: two separate programmes, two audiences. */
export const PARTNERSHIP_LINKS: readonly NavGroup[] = [
  { path: '/referral', label: 'برنامج الإحالة', summary: 'شارك كودك مع مطوّر تعرفه' },
  {
    path: '/partnership',
    label: 'برنامج الشراكات',
    summary: 'للمكاتب الهندسية وشركات إدارة المشاريع',
  },
];

export const PARTNERSHIP_LABEL = 'الشراكات';

export const FOOTER_LEGAL_LINKS: readonly NavLink[] = [
  { path: '/terms', label: 'الشروط والأحكام' },
  { path: '/privacy', label: 'سياسة الخصوصية' },
];

/**
 * The product app, which is a separate system this site links to and does not
 * contain (CONTEXT.md). Ticket 21 makes it editable.
 */
export const SIGN_IN_URL = 'https://rabaedapp.com/signin?lang=ar_ar';
export const SIGN_IN_LABEL = 'تسجيل الدخول';
