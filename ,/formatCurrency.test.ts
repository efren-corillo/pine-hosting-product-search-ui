import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../src/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats zero cents as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats standard whole dollar amounts from cents', () => {
    expect(formatCurrency(500)).toBe('$5.00');
    expect(formatCurrency(1200)).toBe('$12.00');
  });

  it('formats uneven cent amounts accurately without floating-point drift', () => {
    expect(formatCurrency(5)).toBe('$0.05');
    expect(formatCurrency(99)).toBe('$0.99');
    expect(formatCurrency(1850)).toBe('$18.50');
    expect(formatCurrency(8999)).toBe('$89.99');
  });

  it('handles negative cent values and non-finite inputs safely', () => {
    expect(formatCurrency(-450)).toBe('-$4.50');
    expect(formatCurrency(Number.NaN)).toBe('$0.00');
  });
});
