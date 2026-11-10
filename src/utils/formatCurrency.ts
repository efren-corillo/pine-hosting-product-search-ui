/**
 * Formats an integer cent value into a localized USD currency string (e.g. 500 -> "$5.00").
 */
export function formatCurrency(cents: number): string {
  if (!Number.isFinite(cents)) {
    return '$0.00';
  }
  const normalizedCents = Math.round(cents);
  const isNegative = normalizedCents < 0;
  const absDollars = (Math.abs(normalizedCents) / 100).toFixed(2);
  return isNegative ? `-$${absDollars}` : `$${absDollars}`;
}
