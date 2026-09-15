const HTTP_URL_IN_TEXT = /https?:\/\/[^\s<>"']+/i;
const MAX_SHARED_URL_LENGTH = 4096;

function normalizeHttpUrl(value: string | null | undefined): string | null {
  if (!value || value.length > MAX_SHARED_URL_LENGTH) return null;

  try {
    const url = new URL(value.trim());
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:') ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function extractSharedHttpUrl(
  directUrl: string | null | undefined,
  sharedText?: string | null,
): string | null {
  const direct = normalizeHttpUrl(directUrl);
  if (direct) return direct;

  const candidate = sharedText?.match(HTTP_URL_IN_TEXT)?.[0];
  return normalizeHttpUrl(candidate);
}
