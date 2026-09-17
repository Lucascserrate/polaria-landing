export const currency = {
	locale: 'en-US',
	code: 'USD',
} as const;

export function formatPrice(price: number): string {
	return new Intl.NumberFormat(currency.locale, {
		style: 'currency',
		currency: currency.code,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}
