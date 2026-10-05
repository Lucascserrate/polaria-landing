import { Check, Close } from '../icons';
import { cn } from '../cn';
import {
	demoBusiness,
	formatMinutes,
	formatPrice,
	pageDemo,
	weekdayShort,
} from '../content';
import {
	slotsForSelection,
	totalDuration,
	totalPrice,
	type BookableDay,
} from '../business-status';
import type { DemoBooking } from '../use-demo-booking';
import { Confirmation } from './confirmation';
import { Pill } from './pill';

const business = demoBusiness;
const copy = pageDemo.booking;

/**
 * El panel de reserva: qué quiere, qué día, qué hora y cuánto sale.
 *
 * El producto separa servicio, profesional y hora en pantallas distintas; esta
 * demo los apila porque el equipo ya está en la página. Y deja quitar servicios
 * después de elegir hora: es lo que prueba que la grilla depende de la selección.
 */
export function BookingPanel({
	booking,
	days,
}: {
	booking: DemoBooking;
	days: BookableDay[];
}) {
	const { serviceIds, dayIso, time, step } = booking.state;

	if (step === 'done') {
		return <Confirmation booking={booking} days={days} />;
	}

	const day = days.find((candidate) => candidate.iso === dayIso);
	const duration = totalDuration(business.services, serviceIds);
	const price = totalPrice(business.services, serviceIds);
	const slots = slotsForSelection(business.services, serviceIds, day);

	return (
		<div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-paper-300">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h4 className="text-lg font-semibold text-ink-950">{copy.title}</h4>
					<p className="mt-1 text-sm text-ink-600">{copy.lead}</p>
				</div>

				<button
					type="button"
					onClick={booking.close}
					aria-label={pageDemo.actions.close}
					className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink-600 ring-1 ring-inset ring-paper-300 transition-colors hover:bg-paper-200 hover:text-ink-950"
				>
					<Close className="size-4" />
				</button>
			</div>

			<fieldset className="mt-5">
				<legend className="text-sm font-medium text-ink-950">
					{copy.stepService}
				</legend>
				<ul className="mt-2.5 flex flex-wrap gap-2">
					{business.services.map((service) => {
						const selected = serviceIds.includes(service.id);

						return (
							<li key={service.id}>
								<button
									type="button"
									onClick={() => booking.toggleService(service.id)}
									aria-pressed={selected}
									data-demo={`servicio-${service.id}`}
									className={cn(
										'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors',
										selected
											? 'bg-ink-950 text-white'
											: 'bg-white text-ink-900 ring-1 ring-inset ring-paper-300 hover:bg-paper-200',
									)}
								>
									{selected && <Check className="size-3.5" />}
									{service.name}
								</button>
							</li>
						);
					})}
				</ul>
			</fieldset>

			<fieldset className="mt-6">
				<legend className="text-sm font-medium text-ink-950">
					{copy.stepDay}
				</legend>
				<ul className="mt-2.5 grid grid-cols-3 gap-2">
					{days.map((candidate) => {
						const selected = candidate.iso === dayIso;

						return (
							<li key={candidate.iso}>
								<button
									type="button"
									onClick={() => booking.chooseDay(candidate.iso)}
									aria-pressed={selected}
									data-demo={`dia-${candidate.iso}`}
									className={cn(
										'flex h-14 w-full cursor-pointer flex-col items-center justify-center rounded-full text-sm transition-colors',
										selected
											? 'bg-ink-950 text-white'
											: 'bg-white text-ink-900 ring-1 ring-inset ring-paper-300 hover:bg-paper-200',
									)}
								>
									<span className="text-[0.6875rem] uppercase tracking-wide">
										{weekdayShort[candidate.dayOfWeek]}
									</span>
									<span className="text-base font-semibold tabular-nums">
										{candidate.dayOfMonth}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</fieldset>

			{day && serviceIds.length > 0 && (
				<fieldset className="mt-6">
					<legend className="text-sm font-medium text-ink-950">
						{copy.stepTime}
					</legend>

					{slots.length > 0 ? (
						<ul className="mt-2.5 grid grid-cols-3 gap-2">
							{slots.map((slot) => (
								<li key={slot}>
									<button
										type="button"
										onClick={() => booking.chooseTime(slot)}
										aria-pressed={slot === time}
										data-demo={`hora-${slot}`}
										className={cn(
											'flex h-10 w-full cursor-pointer items-center justify-center rounded-full text-sm tabular-nums transition-colors',
											slot === time
												? 'bg-ink-950 text-white'
												: 'bg-white text-ink-900 ring-1 ring-inset ring-paper-300 hover:bg-paper-200',
										)}
									>
										{slot}
									</button>
								</li>
							))}
						</ul>
					) : (
						<p className="mt-2.5 text-sm text-ink-600">{copy.noSlots}</p>
					)}
				</fieldset>
			)}

			<div className="mt-6 border-t border-paper-300 pt-5">
				<dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
					<div className="flex items-baseline gap-2">
						<dt className="text-sm text-ink-600">{copy.total}</dt>
						<dd className="text-lg font-semibold tabular-nums text-ink-950">
							{price === null
								? copy.priceOnSite
								: formatPrice(price, business.currency)}
						</dd>
					</div>

					{duration > 0 && (
						<div className="flex items-baseline gap-2">
							<dt className="text-sm text-ink-600">{copy.duration}</dt>
							<dd className="text-sm tabular-nums text-ink-900">
								{formatMinutes(duration)}
							</dd>
						</div>
					)}
				</dl>

				<Pill
					variant="solid"
					onClick={booking.confirm}
					disabled={!dayIso || !time}
					className="mt-5 w-full"
					demo="confirmar"
				>
					{pageDemo.actions.confirm}
				</Pill>
			</div>
		</div>
	);
}
