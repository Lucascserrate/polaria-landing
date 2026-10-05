'use client';

import { useEffect, useRef } from 'react';

import { cn } from '../cn';
import { currentDayOfWeek, resolveStatus, type BookableDay } from '../business-status';
import { demoBusiness, pageDemo, serviceCount } from '../content';
import type { DemoBooking } from '../use-demo-booking';
import { BookingPanel } from './booking-panel';
import { Cover, cover } from './cover';
import { Location } from './location';
import { PageHeader } from './page-header';
import { Pill } from './pill';
import { Portfolio } from './portfolio';
import { Schedule } from './schedule';
import { scrollWithinScreen } from './scroll-within-screen';
import { Services } from './services';
import { Team } from './team';

const business = demoBusiness;

/**
 * La página pública del negocio de ejemplo.
 *
 * Client Component entero a propósito: el estado de la cabecera depende de la hora
 * y en el servidor quedaría congelado en el build. Sin `sm:`/`lg:` a propósito:
 * esos miden la ventana del navegador, no el teléfono.
 *
 * La reserva, los días y la hora llegan por prop desde `<PhoneDemo>`: el mismo
 * estado que mueve la demostración automática, para que no haya dos copias.
 */
export function BusinessPage({
	booking,
	days,
	now,
}: {
	booking: DemoBooking;
	days: BookableDay[];
	now: Date;
}) {
	const { step } = booking.state;

	const status = resolveStatus(business.hours, business.timezone, now);
	const today = currentDayOfWeek(business.timezone, now);

	const panelRef = useRef<HTMLDivElement>(null);

	// Al abrir el panel se muestra solo, sin que haya que buscarlo con la vista.
	useEffect(() => {
		if (step === 'closed') return;
		scrollWithinScreen(panelRef.current);
	}, [step]);

	return (
		<div className="bg-white">
			<Cover />

			<div
				className={cn(
					'relative bg-white px-4',
					cover ? '-mt-6 rounded-t-3xl pt-6' : 'pt-4',
				)}
			>
				<PageHeader
					status={status}
					onDirections={() =>
						scrollWithinScreen(document.getElementById('demo-ubicacion'))
					}
				/>

				{step !== 'closed' && (
					<div ref={panelRef}>
						<BookingPanel booking={booking} days={days} />
					</div>
				)}

				<div className="mt-8 min-w-0 space-y-10 pb-8">
					<Services booking={booking} />
					<Schedule today={today} />
					<Team />
					<Portfolio />
					<Location />
				</div>
			</div>

			{step === 'closed' && (
				<div className="sticky bottom-0 z-10 border-t border-paper-300 bg-white px-4 py-3">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm text-ink-600">
							{serviceCount(business.services.length)}
						</p>
						<Pill
							variant="solid"
							onClick={booking.open}
							demo="reservar-ahora"
						>
							{pageDemo.actions.reserveNow}
						</Pill>
					</div>
				</div>
			)}

			<footer className="px-4 py-6 text-center text-sm text-ink-500">
				{pageDemo.pageFooter.poweredBy}{' '}
				<span className="font-medium text-ink-700">
					{pageDemo.pageFooter.product}
				</span>
			</footer>
		</div>
	);
}

