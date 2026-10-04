import { demoBusiness, formatPrice, pageDemo, type DemoService } from '@/content/page-demo';

const business = demoBusiness;
const copy = pageDemo.booking;

export function priceOf(service: DemoService): string {
	return service.price === null
		? copy.priceOnSite
		: formatPrice(service.price, business.currency);
}
