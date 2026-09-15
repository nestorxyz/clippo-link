export interface ChatRecord {
  role: string;
  parts: unknown;
}

export type ActivationStep = 'save' | 'retrieve' | 'complete';

type FunctionResponse = {
  name?: unknown;
  response?: Record<string, unknown>;
};

const responseStatus = ({ name, response = {} }: FunctionResponse): string => {
  if (name === 'register_link') {
    if (response.success !== true) {
      return `Could not save the link: ${String(response.message ?? response.error ?? 'unknown error')}`;
    }
    const data = response.data as Record<string, unknown> | undefined;
    return data?.duplicate === true ? 'Link was already saved.' : 'Link saved.';
  }
  if (name === 'get_url_info') {
    return response.success === true
      ? 'Link analyzed.'
      : `Could not analyze the link: ${String(response.error ?? 'unknown error')}`;
  }
  if (name === 'get_links') {
    const links = Array.isArray(response.links) ? response.links : [];
    return `Found ${links.length} saved ${links.length === 1 ? 'link' : 'links'}.`;
  }
  return '';
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
