import { describe, expect, it } from 'vitest';
import { normalizeSavedUrl, tryNormalizeSavedUrl } from './normalizeSavedUrl';

describe('normalizeSavedUrl', () => {
  it('removes fragments and normalizes URL syntax', () => {
    expect(normalizeSavedUrl('HTTPS://Example.COM:443/path#section')).toBe(
      'https://example.com/path',
    );
  });

  it('keeps query values because they can identify different content', () => {
    expect(normalizeSavedUrl('https://example.com/watch?v=one')).not.toBe(
      normalizeSavedUrl('https://example.com/watch?v=two'),
    );
  });

  it('rejects non-web URLs and embedded credentials', () => {
    expect(() => normalizeSavedUrl('file:///tmp/private')).toThrow(/HTTP/);
    expect(() => normalizeSavedUrl('https://user:pass@example.com')).toThrow(
      /credentials/,
    );
  });

  it('supports tolerant normalization for legacy records', () => {
    expect(tryNormalizeSavedUrl('not a URL')).toBeNull();
  });
});
