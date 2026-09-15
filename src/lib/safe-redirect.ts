const INTERNAL_REDIRECT_BASE = new URL('https://doryai.invalid');

export function safeInternalRedirect(
  value: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  try {
    const target = new URL(value, INTERNAL_REDIRECT_BASE);
    if (target.origin !== INTERNAL_REDIRECT_BASE.origin) {
      return fallback;
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
