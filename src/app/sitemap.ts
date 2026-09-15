import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

const publicRoutes = ['/', '/privacy', '/security', '/terms'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).href,
    changeFrequency: route === '/' ? 'weekly' : 'yearly',
    priority: route === '/' ? 1 : 0.3,
  }));
}
