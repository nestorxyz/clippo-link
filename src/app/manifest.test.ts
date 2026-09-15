import { describe, expect, it } from 'vitest';
import manifest from './manifest.json';

describe('PWA manifest', () => {
  it('opens the installed app at the dashboard in standalone mode', () => {
    expect(manifest).toMatchObject({
      id: '/dashboard',
      start_url: '/dashboard',
      scope: '/',
      display: 'standalone',
    });
  });

  it('receives shared text and URLs without declaring a write request', () => {
    expect(manifest.share_target).toEqual({
      action: '/share',
      method: 'GET',
      params: { title: 'title', text: 'text', url: 'url' },
    });
  });

  it('provides the two declared maskable icon sizes', () => {
    expect(manifest.icons.map(({ sizes }) => sizes)).toEqual([
      '192x192',
      '512x512',
    ]);
  });
});
