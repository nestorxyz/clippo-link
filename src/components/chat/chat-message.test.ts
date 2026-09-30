import { describe, expect, it } from 'vitest';
import {
  formatChatRecord,
  getActivationStep,
  getSearchResultPreviews,
} from './chat-message';

describe('chat message status', () => {
  it('renders successful and duplicate link outcomes', () => {
    expect(
      formatChatRecord({
        role: 'function',
        parts: [
          {
            functionResponse: {
              name: 'register_link',
              response: { success: true, data: { duplicate: false } },
            },
          },
        ],
      }),
    ).toBe('Link saved.');
    expect(
      formatChatRecord({
        role: 'function',
        parts: [
          {
            functionResponse: {
              name: 'register_link',
              response: { success: true, data: { duplicate: true } },
            },
          },
        ],
      }),
    ).toBe('Link was already saved.');
  });

  it('renders a legible extraction failure', () => {
    expect(
      formatChatRecord({
        role: 'function',
        parts: [
          {
            functionResponse: {
              name: 'get_url_info',
              response: { success: false, error: 'Page blocked' },
            },
          },
        ],
      }),
    ).toBe('Could not analyze the link: Page blocked');
  });

  it('labels LinkedIn previews and metadata-only saves without claiming full text', () => {
    expect(
      formatChatRecord({
        role: 'function',
        parts: [
          {
            functionResponse: {
              name: 'get_url_info',
              response: { success: true, contentScope: 'partial-preview' },
            },
          },
          {
            functionResponse: {
              name: 'register_link',
              response: {
                success: true,
                data: { duplicate: false, contentScope: 'partial-preview' },
              },
            },
          },
        ],
      }),
    ).toBe(
      'LinkedIn preview analyzed (may be incomplete).\nLink saved (partial LinkedIn preview; may be incomplete).',
    );

    expect(
      formatChatRecord({
        role: 'function',
        parts: [
          {
            functionResponse: {
              name: 'register_link',
              response: {
                success: true,
                data: { duplicate: false, contentScope: 'metadata-only' },
              },
            },
          },
        ],
      }),
    ).toBe('Link saved (LinkedIn metadata only; post text unavailable).');
  });
});

describe('first-run activation', () => {
  const response = (
    name: string,
    payload: Record<string, unknown>,
  ) => ({
    role: 'function',
    parts: [{ functionResponse: { name, response: payload } }],
  });

  it('starts with saving and advances only after a new link is saved', () => {
    expect(getActivationStep([])).toBe('save');
    expect(
      getActivationStep([
        response('register_link', {
          success: true,
          data: { duplicate: true },
        }),
      ]),
    ).toBe('save');
    expect(
      getActivationStep([
        response('register_link', {
          success: true,
          data: { duplicate: false },
        }),
      ]),
    ).toBe('retrieve');
  });

  it('completes only when a later retrieval returns a saved link', () => {
    const saved = response('register_link', {
      success: true,
      data: { duplicate: false },
    });

    expect(
      getActivationStep([
        response('get_links', { links: [{ id: 'before-save' }] }),
        saved,
      ]),
    ).toBe('retrieve');
    expect(
      getActivationStep([saved, response('get_links', { links: [] })]),
    ).toBe('retrieve');
    expect(
      getActivationStep([
        saved,
        response('get_links', { links: [{ id: 'saved-link' }] }),
      ]),
    ).toBe('complete');
  });
});

describe('saved search results', () => {
  it('renders an honest empty state and a selected-link read status', () => {
    expect(formatChatRecord({
      role: 'function',
      parts: [{ functionResponse: { name: 'get_links', response: { links: [] } } }],
    })).toBe('No saved links matched that search.');
    expect(formatChatRecord({
      role: 'function',
      parts: [{ functionResponse: { name: 'get_link', response: { success: true } } }],
    })).toBe('Read saved link content.');
  });

  it('shows only safe saved URLs and labels partial previews', () => {
    const previews = getSearchResultPreviews({
      role: 'function',
      parts: [{ functionResponse: {
        name: 'get_links',
        response: { links: [
          { id: 'a', title: 'Founder story', url: 'https://example.com/a', imgPreview: 'https://cdn.example.com/a.jpg', contentExcerpt: 'The story text', contentScope: 'partial-preview' },
          { id: 'b', title: 'Unsafe', url: 'javascript:alert(1)' },
        ] },
      } }],
    });
    expect(previews).toEqual([{
      id: 'a',
      title: 'Founder story',
      url: 'https://example.com/a',
      imgPreview: 'https://cdn.example.com/a.jpg',
      excerpt: 'The story text',
      contentScope: 'partial-preview',
    }]);
  });

  it('ignores unsafe or malformed preview images without hiding a saved result', () => {
    const previews = getSearchResultPreviews({
      role: 'function',
      parts: [{ functionResponse: {
        name: 'get_links',
        response: { links: [
          { id: 'a', title: 'First', url: 'https://example.com/a', imgPreview: 'javascript:alert(1)' },
          { id: 'b', title: 'Second', url: 'https://example.com/b', imgPreview: 'not a url' },
        ] },
      } }],
    });
    expect(previews.map(({ imgPreview }) => imgPreview)).toEqual([undefined, undefined]);
  });
});
