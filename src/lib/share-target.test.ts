import { describe, expect, it } from 'vitest';
import { extractSharedHttpUrl } from './share-target';

describe('mobile share target input', () => {
  it('prefers a valid directly shared URL', () => {
    expect(
      extractSharedHttpUrl(
        'https://example.com/article?ref=phone#section',
        'See https://ignored.example',
      ),
    ).toBe('https://example.com/article?ref=phone#section');
  });

  it('extracts an HTTP URL from shared text when no URL field is supplied', () => {
    expect(
      extractSharedHttpUrl(null, 'Worth saving: https://example.com/read'),
    ).toBe('https://example.com/read');
  });

  it.each([
    'javascript:alert(1)',
    'file:///private/note',
    'https://user:password@example.com/private',
    'not a URL',
  ])('rejects unsupported or credential-bearing input: %s', (value) => {
    expect(extractSharedHttpUrl(value)).toBeNull();
  });
});
