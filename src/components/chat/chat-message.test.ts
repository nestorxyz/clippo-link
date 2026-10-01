import { describe, expect, it } from 'vitest';
import {
  formatChatRecord,
  getActivationStep,
  getSavedLinkPreview,
  getSavedLinkPreviewsById,
  getSearchResultPreviews,
  suggestedSavedLinkQuestion,
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
    expect(getActivationStep([], true)).toBe('ready');
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
          data: { id: 'saved-link', duplicate: false },
        }),
      ]),
    ).toBe('retrieve');
  });

  it('completes only when a later answer follows retrieval of the newly saved link', () => {
    const saved = response('register_link', {
      success: true,
      data: { id: 'saved-link', duplicate: false },
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
        response('get_links', { links: [{ id: 'different-link' }] }),
      ]),
    ).toBe('retrieve');
    expect(
      getActivationStep([
        saved,
        response('get_links', { links: [{ id: 'saved-link' }] }),
      ]),
    ).toBe('retrieve');
    expect(getActivationStep([
      saved,
      response('get_links', { links: [{ id: 'saved-link' }] }),
      { role: 'model', parts: [{ text: 'Here is what your link says.' }] },
    ])).toBe('complete');
    expect(getActivationStep([
      saved,
      response('get_links', { links: [{ id: 'saved-link' }] }),
      { role: 'user', parts: [{ text: 'New question' }] },
      { role: 'model', parts: [{ text: 'An unrelated answer.' }] },
    ])).toBe('retrieve');
  });

  it('completes a focused saved-link answer without searching other links', () => {
    const saved = response('register_link', {
      success: true,
      data: { id: 'saved-link', duplicate: false },
    });
    const exactQuestion = {
      role: 'user',
      contextLinkId: 'saved-link',
      parts: [{ text: 'What does this saved link say?' }],
    };
    expect(getActivationStep([saved, exactQuestion])).toBe('retrieve');
    expect(getActivationStep([
      saved,
      { ...exactQuestion, contextLinkId: 'another-link' },
      { role: 'model', parts: [{ text: 'An unrelated answer.' }] },
    ])).toBe('retrieve');
    expect(getActivationStep([
      saved,
      exactQuestion,
      { role: 'model', parts: [{ text: 'Here is what was saved.' }] },
    ])).toBe('complete');
  });
});

describe('post-save onboarding', () => {
  const record = (payload: Record<string, unknown>) => ({
    role: 'function',
    parts: [{ functionResponse: { name: 'register_link', response: payload } }],
  });

  it('shows only a newly persisted, safe link and a bounded description', () => {
    const saved = getSavedLinkPreview(record({
      success: true,
      data: {
        id: 'link-1',
        duplicate: false,
        title: 'Starting a business',
        url: 'https://example.com/guide',
        description: 'A'.repeat(300),
        img_preview: 'https://cdn.example.com/thumb.jpg',
        content: 'Full source text',
      },
    }));
    expect(saved).toEqual({
      id: 'link-1',
      title: 'Starting a business',
      url: 'https://example.com/guide',
      description: 'A'.repeat(240),
      imgPreview: 'https://cdn.example.com/thumb.jpg',
      hasContent: true,
      contentScope: undefined,
    });
    expect(suggestedSavedLinkQuestion()).toContain('this saved link');
    expect(suggestedSavedLinkQuestion()).not.toContain('https://');
  });

  it('never shows a duplicate, failed save, or unsafe URL as a new save', () => {
    const base = { id: 'link-1', title: 'A link', url: 'https://example.com' };
    expect(getSavedLinkPreview(record({ success: false, data: base }))).toBeNull();
    expect(getSavedLinkPreview(record({
      success: true,
      data: { ...base, duplicate: true },
    }))).toBeNull();
    expect(getSavedLinkPreview(record({
      success: true,
      data: { ...base, url: 'javascript:alert(1)' },
    }))).toBeNull();
    expect(getSavedLinkPreview(record({
      success: true,
      data: { ...base, url: 'https://user:pass@example.com' },
    }))).toBeNull();
  });

  it('keeps honest partial-content labels and rejects unsafe images', () => {
    expect(getSavedLinkPreview(record({
      success: true,
      data: {
        id: 'link-2',
        duplicate: false,
        title: 'A LinkedIn post',
        url: 'https://www.linkedin.com/posts/example',
        img_preview: 'javascript:alert(1)',
        contentScope: 'partial-preview',
      },
    }))).toMatchObject({
      contentScope: 'partial-preview',
      hasContent: false,
      imgPreview: undefined,
    });
  });

  it('keeps the guided question short and displays only the selected saved link', () => {
    const records = [
      record({ success: true, data: {
        id: 'first', title: 'First', url: 'https://example.com/first',
      } }),
      record({ success: true, data: {
        id: 'second', title: 'Second', url: 'https://example.com/second',
      } }),
    ];
    const savedLinks = getSavedLinkPreviewsById(records);
    expect(savedLinks.get('second')?.title).toBe('Second');
    expect(savedLinks.get('unrelated')).toBeUndefined();
    expect(suggestedSavedLinkQuestion()).not.toContain('First');
    expect(suggestedSavedLinkQuestion()).not.toContain('Second');
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
