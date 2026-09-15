interface ChatRecord {
  role: string;
  parts: unknown;
}

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
