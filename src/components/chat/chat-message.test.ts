import { describe, expect, it } from 'vitest';
import { formatChatRecord, getActivationStep } from './chat-message';

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
