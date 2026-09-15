import { describe, expect, it } from 'vitest';
import { formatChatRecord } from './chat-message';

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
