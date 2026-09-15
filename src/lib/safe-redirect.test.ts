import { describe, expect, it } from 'vitest';
import { safeInternalRedirect } from './safe-redirect';

describe('safe internal redirect', () => {
  it('preserves a local path, query, and fragment', () => {
    expect(
      safeInternalRedirect('/auth/after?plan=annual#checkout'),
    ).toBe('/auth/after?plan=annual#checkout');
  });

  it.each([
    'https://attacker.example/path',
    '//attacker.example/path',
    '/\\attacker.example/path',
    'dashboard',
    '',
  ])('rejects an unsafe redirect target: %s', (target) => {
    expect(safeInternalRedirect(target)).toBe('/dashboard');
  });
});
