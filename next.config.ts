import type { NextConfig } from 'next';
import { isIndexable } from './src/lib/environment';

/**
 * `X-Robots-Tag` alongside the `<meta name="robots">` the layouts emit. The
 * meta tag only exists inside an HTML body a crawler chose to parse; the
 * header covers everything else it may fetch, and is what it sees on a HEAD
 * request. Both are cheap and the failure they guard against is not
 * recoverable once a page has been crawled.
 */
const nextConfig: NextConfig = {
  async headers() {
    if (isIndexable()) return [];

    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
