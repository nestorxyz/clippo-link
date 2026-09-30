export interface ChatRecord {
  role: string;
  parts: unknown;
}

export type ActivationStep = 'save' | 'retrieve' | 'complete';

export interface SearchResultPreview {
  id: string;
  title: string;
  url: string;
  imgPreview?: string;
  excerpt?: string;
  contentScope?: 'partial-preview' | 'metadata-only';
}

type FunctionResponse = {
  name?: unknown;
  response?: Record<string, unknown>;
};

const safePreviewImage = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
};

const responseStatus = ({ name, response = {} }: FunctionResponse): string => {
  if (name === 'register_link') {
    if (response.success !== true) {
      return `Could not save the link: ${String(response.message ?? response.error ?? 'unknown error')}`;
    }
    const data = response.data as Record<string, unknown> | undefined;
    if (data?.duplicate === true) return 'Link was already saved.';
    if (data?.contentScope === 'partial-preview') {
      return 'Link saved (partial LinkedIn preview; may be incomplete).';
    }
    if (data?.contentScope === 'metadata-only') {
      return 'Link saved (LinkedIn metadata only; post text unavailable).';
    }
    return 'Link saved.';
  }
  if (name === 'get_url_info') {
    if (response.success !== true) {
      return `Could not analyze the link: ${String(response.error ?? 'unknown error')}`;
    }
    if (response.contentScope === 'partial-preview') {
      return 'LinkedIn preview analyzed (may be incomplete).';
    }
    if (response.contentScope === 'metadata-only') {
      return 'LinkedIn metadata analyzed (post text unavailable).';
    }
    return 'Link analyzed.';
  }
  if (name === 'get_links') {
    if (response.error) return 'Could not search saved links. Please try again.';
    const links = Array.isArray(response.links) ? response.links : [];
    return links.length === 0
      ? 'No saved links matched that search.'
      : `Found ${links.length} saved ${links.length === 1 ? 'link' : 'links'}.`;
  }
  if (name === 'get_link') {
    return response.success === true
      ? 'Read saved link content.'
      : 'Could not read that saved link.';
  }
  return '';
};

export const getSearchResultPreviews = (
  record: ChatRecord,
): SearchResultPreview[] => {
  if (!Array.isArray(record.parts)) return [];
  const previews: SearchResultPreview[] = [];
  for (const part of record.parts) {
    if (!part || typeof part !== 'object') continue;
    const responsePart = (part as Record<string, unknown>).functionResponse;
    if (!responsePart || typeof responsePart !== 'object') continue;
    const { name, response } = responsePart as FunctionResponse;
    if (name !== 'get_links' || !Array.isArray(response?.links)) continue;

    for (const candidate of response.links.slice(0, 5)) {
      if (!candidate || typeof candidate !== 'object') continue;
      const link = candidate as Record<string, unknown>;
      if (
        typeof link.id !== 'string' ||
        typeof link.title !== 'string' ||
        typeof link.url !== 'string'
      ) continue;
      try {
        const url = new URL(link.url);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') continue;
      } catch {
        continue;
      }
      previews.push({
        id: link.id,
        title: link.title,
        url: link.url,
        imgPreview: safePreviewImage(link.imgPreview),
        excerpt:
          typeof link.contentExcerpt === 'string'
            ? link.contentExcerpt.slice(0, 160)
            : typeof link.description === 'string'
              ? link.description.slice(0, 160)
              : undefined,
        contentScope:
          link.contentScope === 'partial-preview' ||
          link.contentScope === 'metadata-only'
            ? link.contentScope
            : undefined,
      });
    }
  }
  return previews;
};

export const formatChatRecord = (record: ChatRecord): string => {
  if (!Array.isArray(record.parts)) return '';

  return record.parts
    .map((part: unknown) => {
      if (!part || typeof part !== 'object') return '';
      const value = part as Record<string, unknown>;
      if (typeof value.text === 'string') return value.text;
      if (value.functionResponse && typeof value.functionResponse === 'object') {
        return responseStatus(value.functionResponse as FunctionResponse);
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
};

export const getActivationStep = (records: ChatRecord[]): ActivationStep => {
  let saved = false;

  for (const record of records) {
    if (!Array.isArray(record.parts)) continue;

    for (const part of record.parts) {
      if (!part || typeof part !== 'object') continue;
      const value = part as Record<string, unknown>;
      if (!value.functionResponse || typeof value.functionResponse !== 'object') {
        continue;
      }

      const { name, response = {} } =
        value.functionResponse as FunctionResponse;
      if (name === 'register_link' && response.success === true) {
        const data = response.data as Record<string, unknown> | undefined;
        if (data?.duplicate !== true) saved = true;
      }

      if (
        saved &&
        name === 'get_links' &&
        Array.isArray(response.links) &&
        response.links.length > 0
      ) {
        return 'complete';
      }
    }
  }

  return saved ? 'retrieve' : 'save';
};
