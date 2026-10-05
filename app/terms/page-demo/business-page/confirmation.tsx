import { CalendarCheck } from '../icons';
import {
	demoBusiness,
	formatMinutes,
	formatPrice,
	pageDemo,
	weekdayNames,
} from '../content';
import {
	dayLabel,
	monthNames,
	totalDuration,
	totalPrice,
	type BookableDay,
} from '../business-status';
import type { DemoBooking } from '../use-demo-booking';
import { Pill } from './pill';
import { priceOf } from './price-of';

const business = demoBusiness;
const copy = pageDemo.booking;

/**
 * El comprobante: el turno, lo que salió y los datos del negocio. El aviso de que
 * no se reservó nada va arriba de todo, porque es lo primero que tiene que ver
 * quien está probando.
 */
export function Confirmation({
	booking,
	days,
}: {
	booking: DemoBooking;
	days: BookableDay[];
}) {
	const { serviceIds, dayIso, time } = booking.state;
	const day = days.find((candidate) => candidate.iso === dayIso);
	const selected = business.services.filter((service) =>
		serviceIds.includes(service.id),
	);
	const duration = totalDuration(business.services, serviceIds);
	const price = totalPrice(business.services, serviceIds);

	return (
		<div
			data-demo="comprobante"
			className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-paper-300"
		>
			<div className="flex items-start gap-4">
				<span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-950 text-white">
					<CalendarCheck className="size-5" />
				</span>

				<div>
					<h4 className="text-lg font-semibold text-ink-950">
						{copy.done.title}
					</h4>
				</div>
			</div>

			<p className="mt-5 text-sm font-medium text-ink-950">
				{day ? dayLabel(day, weekdayNames, monthNames) : null}
				{time && ` · ${time}`}
			</p>

			<ul className="mt-3 divide-y divide-paper-300 overflow-hidden rounded-2xl ring-1 ring-inset ring-paper-300">
				{selected.map((service) => (
					<li
						key={service.id}
						className="flex items-baseline justify-between gap-4 px-4 py-3"
					>
						<span className="min-w-0">
							<span className="block text-sm font-medium text-ink-950">
								{service.name}
							</span>
							<span className="block text-xs text-ink-500">
								{formatMinutes(service.durationMinutes)}
							</span>
						</span>
						<span className="shrink-0 text-sm font-semibold tabular-nums text-ink-950">
							{priceOf(service)}
						</span>
					</li>
				))}

				<li className="flex items-baseline justify-between gap-4 bg-paper-100 px-4 py-3">
					<span className="text-sm font-medium text-ink-950">
						{price === null ? copy.duration : copy.total}
					</span>
					<span className="text-sm font-semibold tabular-nums text-ink-950">
						{price === null
							? formatMinutes(duration)
							: formatPrice(price, business.currency)}
					</span>
				</li>
			</ul>

			<div className="mt-5 rounded-2xl bg-paper-200 p-4">
				<p className="text-sm font-medium text-ink-950">
					{copy.done.important}
				</p>
				<p className="mt-1 text-sm leading-relaxed text-ink-900 whitespace-pre-line">
					{business.importantInfo}
				</p>
			</div>

			<div className="mt-5 flex flex-wrap items-center gap-3">
				<Pill variant="solid" onClick={booking.reset}>
					{pageDemo.actions.gotIt}
				</Pill>
				<button
					type="button"
					onClick={booking.reset}
					className="cursor-pointer text-sm text-ink-600 underline-offset-4 transition-colors hover:text-ink-950 hover:underline"
				>
					{pageDemo.actions.restart}
				</button>
			</div>
		</div>
	);
}
