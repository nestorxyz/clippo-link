type SiteEnvironment = {
  SITE_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

const localUrl = new URL('http://localhost:3000');

const asUrl = (value?: string): URL | null => {
  if (!value) return null;

  try {
    return new URL(value.includes('://') ? value : `https://${value}`);
  } catch {
    return null;
  }
};

export const resolveSiteConfig = (environment: SiteEnvironment) => {
  const configuredUrl = asUrl(environment.SITE_URL);
  const vercelProductionUrl = asUrl(
    environment.VERCEL_PROJECT_PRODUCTION_URL,
  );
  const url = configuredUrl ?? vercelProductionUrl ?? localUrl;

  return {
    url,
    indexable:
      environment.VERCEL_ENV === 'production' &&
      (configuredUrl !== null || vercelProductionUrl !== null),
  };
};

export const siteConfig = resolveSiteConfig({
  SITE_URL: process.env.SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL:
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
});
