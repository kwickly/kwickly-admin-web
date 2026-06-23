/**
 * Utility for formatting currency across the application based on ISO 4217 standards.
 * The `Intl.NumberFormat` automatically handles the placement of symbols and decimal structures
 * based on the user's locale, but fixes the currency to the specified ISO code.
 */
export const formatCurrency = (amount: number, currencyCode: string = "INR") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount);
};
