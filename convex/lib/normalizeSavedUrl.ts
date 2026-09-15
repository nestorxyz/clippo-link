export const normalizeSavedUrl = (input: string): string => {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error('Link URL must be a valid absolute URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Link URL must use HTTP or HTTPS');
  }
  if (url.username || url.password) {
    throw new Error('Link URL must not contain credentials');
  }

  url.hash = '';
  return url.toString();
};

export const tryNormalizeSavedUrl = (input: string): string | null => {
  try {
    return normalizeSavedUrl(input);
  } catch {
    return null;
  }
};
