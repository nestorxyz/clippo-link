import { describe, expect, it } from 'vitest';
import { buildLinkSearchText } from './linkSearch';

describe('buildLinkSearchText', () => {
  it('includes saved content so search is not title-only', () => {
    const text = buildLinkSearchText({
      title: 'A short title',
      description: 'A description',
      content: 'Use what you have before seeking funding.',
      url: 'https://example.com/video',
    });

    expect(text).toContain('use what you have');
    expect(text).toContain('a description');
  });

  it('bounds index size without losing title and description', () => {
    const text = buildLinkSearchText({
      title: 'Important title',
      description: 'Important description',
      content: 'x'.repeat(30_000),
      url: 'https://example.com',
    });

    expect(text.length).toBe(25_000);
    expect(text).toContain('important title');
    expect(text).toContain('important description');
  });

  it('folds accents for Spanish search terms', () => {
    expect(buildLinkSearchText({
      title: 'Síndrome del impostor',
      url: 'https://example.com',
    })).toContain('sindrome del impostor');
  });
});
