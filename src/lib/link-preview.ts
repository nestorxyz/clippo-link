export const safePreviewImage = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') &&
      !url.username && !url.password
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
};

export const youtubeThumbnailFromUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split('/').filter(Boolean);
    let id: string | null = null;
    if (host === 'youtu.be' && parts.length === 1) {
      id = parts[0];
    } else if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      if (parts.length === 1 && parts[0] === 'watch') {
        id = url.searchParams.get('v');
      } else if (
        parts.length === 2 &&
        ['shorts', 'live', 'embed'].includes(parts[0])
      ) {
        id = parts[1];
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id)
      ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      : undefined;
  } catch {
    return undefined;
  }
};

export const previewImageCandidates = (
  linkUrl: string,
  savedImage: unknown,
): string[] => {
  const saved = safePreviewImage(savedImage);
  const youtube = youtubeThumbnailFromUrl(linkUrl);
  return [...new Set([saved, youtube].filter((url): url is string => Boolean(url)))];
};
