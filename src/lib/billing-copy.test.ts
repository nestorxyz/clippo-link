import { describe, expect, it } from 'vitest';
import { PAID_PLAN_COPY } from './billing-copy';

describe('paid plan copy', () => {
  it('keeps one monthly and one annual plan with the observed prices', () => {
    expect(
      PAID_PLAN_COPY.map(({ key, price }) => ({ key, price })),
    ).toEqual([
      { key: 'monthly', price: '$4.99' },
      { key: 'annual', price: '$34.99' },
    ]);
  });

  it('does not advertise unresolved quotas or unsupported service tiers', () => {
    const renderedCopy = JSON.stringify(PAID_PLAN_COPY).toLowerCase();

    expect(renderedCopy).not.toContain('200');
    expect(renderedCopy).not.toContain('vip');
    expect(renderedCopy).not.toContain('priority');
    expect(renderedCopy).not.toContain('all features');
  });
});
