import { cn } from '@/lib/utils';
import { demoBusiness, formatMinutes, pageDemo } from '@/content/page-demo';
import type { DemoBooking } from '../use-demo-booking';
import { Pill } from './pill';
import { priceOf } from './price-of';

const business = demoBusiness;
const labels = pageDemo.labels;

/**
 * Los servicios: nombre, duración, precio y un botón. La descripción se lee recién
 * al elegir el servicio, como en el producto. El botón no es decorativo: elige ese
 * servicio y abre el panel, el gesto más corto que prueba que se reserva desde la
 * página.
 */
export function Services({ booking }: { booking: DemoBooking }) {
	const { serviceIds, step } = booking.state;

	return (
		<section aria-labelledby="servicios" className="space-y-4">
			<h4 id="servicios" className="text-xl font-semibold text-ink-950">
				{labels.services}
			</h4>

			<ul className="space-y-3">
				{business.services.map((service) => {
					const selected = serviceIds.includes(service.id);

					return (
						<li key={service.id}>
							<div
								className={cn(
									'flex items-center justify-between gap-3 rounded-2xl px-4 py-4 ring-1 ring-inset transition-colors',
									selected
										? 'bg-paper-100 ring-ink-950'
										: 'bg-white ring-paper-300',
								)}
							>
								<div className="min-w-0">
									<p className="font-medium text-ink-950">{service.name}</p>
									<p className="mt-0.5 text-sm text-ink-500">
										{formatMinutes(service.durationMinutes)}
									</p>
									<p className="mt-2 font-semibold tabular-nums text-ink-950">
										{priceOf(service)}
									</p>
								</div>

								<Pill
									onClick={
										step === 'closed'
											? () => booking.chooseService(service.id)
											: () => booking.toggleService(service.id)
									}
									label={`${pageDemo.actions.reserve} ${service.name}`}
									className="h-10 px-4"
								>
									{pageDemo.actions.reserve}
								</Pill>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

