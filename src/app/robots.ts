import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.indexable
      ? {
          userAgent: '*',
          allow: ['/', '/privacy', '/security', '/terms'],
          disallow: ['/auth/', '/dashboard/', '/sign-in/'],
        }
      : { userAgent: '*', disallow: '/' },
    sitemap: new URL('/sitemap.xml', siteConfig.url).href,
  };
}
