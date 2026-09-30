const MAX_SEARCH_TEXT_LENGTH = 25_000;

export const buildLinkSearchText = (fields: {
  title: string;
  description?: string;
  content?: string;
  url: string;
  source?: string;
}): string =>
  [
    fields.title,
    fields.description,
    fields.source,
    fields.url,
    fields.content,
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join('\n')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en')
    .slice(0, MAX_SEARCH_TEXT_LENGTH);

export const matchesLegacyLinkQuery = (
  fields: Parameters<typeof buildLinkSearchText>[0],
  queryText: string,
): boolean => {
  const terms = buildLinkSearchText({
    title: queryText,
    url: '',
  }).match(/[\p{L}\p{N}]+/gu);
  if (!terms?.length) return false;
  const words = new Set(
    buildLinkSearchText(fields).match(/[\p{L}\p{N}]+/gu) ?? [],
  );
  return terms.some((term) => words.has(term));
};
