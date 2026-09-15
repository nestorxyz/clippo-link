import { describe, expect, it } from 'vitest';
import { resolveSiteConfig } from './site-config';

describe('site configuration', () => {
  it('keeps local and Preview builds out of search indexes', () => {
    expect(resolveSiteConfig({}).indexable).toBe(false);
    expect(
      resolveSiteConfig({
        VERCEL_ENV: 'preview',
        VERCEL_PROJECT_PRODUCTION_URL: 'dory.example',
      }).indexable,
    ).toBe(false);
  });

  it('uses an explicitly configured production URL', () => {
    const config = resolveSiteConfig({
      SITE_URL: 'https://links.example.com',
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'old.example.com',
    });

    expect(config.url.href).toBe('https://links.example.com/');
    expect(config.indexable).toBe(true);
  });

  it('uses Vercel production URL only for canonical production output', () => {
    const config = resolveSiteConfig({
      VERCEL_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'dory.example',
    });

    expect(config.url.href).toBe('https://dory.example/');
    expect(config.indexable).toBe(true);
  });

  it('falls back safely when a configured URL is invalid', () => {
    const config = resolveSiteConfig({
      SITE_URL: 'not a valid host',
      VERCEL_ENV: 'production',
    });

    expect(config.url.href).toBe('http://localhost:3000/');
    expect(config.indexable).toBe(false);
  });
});
