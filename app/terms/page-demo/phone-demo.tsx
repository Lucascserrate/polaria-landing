'use client';

import { useRef } from 'react';

import { Pause, Play } from './icons';
import { upcomingDays } from './business-status';
import { BusinessPage } from './business-page';
import { TAP_CSS, useDemoAutoplay } from './business-page/use-demo-autoplay';
import { demoBusiness, pageDemo } from './content';
import { PhoneFrame } from './phone-frame';
import { useDemoBooking } from './use-demo-booking';

const business = demoBusiness;

/**
 * El teléfono de la demostración, y el botón que la frena.
 *
 * Vive el estado acá y no en `<BusinessPage>` porque la animación automática
 * necesita la misma reserva, los mismos días y el mismo reloj que la pantalla: si
 * la página y el hook tuvieran su propia copia, el ciclo podría apretar un turno
 * que el panel no está mostrando.
 *
 * Es Client Component entero a propósito, como la página: el estado de la cabecera
 * sale de la hora, y en el servidor se calcularía una vez y quedaría congelado en
 * el build —un sitio estático que dice "Cerrado" un martes a las once de la mañana
 * es peor que uno que no dice nada—.
 */
export function PhoneDemo() {
	const frameRef = useRef<HTMLDivElement>(null);
	const booking = useDemoBooking();

	/*
	 * `new Date()` en el render y no en un estado: en un `useState` el servidor lo
	 * correría una vez y la hora quedaría horneada en el HTML para siempre. Leerla
	 * en cada render no necesita `useMemo` —la diferencia es de segundos—.
	 */
	const now = new Date();
	const days = upcomingDays(business.hours, business.timezone, now, 6);

	const autoplay = useDemoAutoplay({ booking, days, frameRef });

	return (
		<>
			{/*
			 * Keyframes propios, como en la demo de WhatsApp: el anillo no depende
			 * del plugin de animación de Tailwind.
			 */}
			<style>{TAP_CSS}</style>

			<div ref={frameRef}>
				<PhoneFrame>
					<BusinessPage booking={booking} days={days} now={now} />
				</PhoneFrame>
			</div>

			{/*
			 * Con movimiento reducido no se muestra: no hay nada en movimiento que
			 * pausar y la página ya avisa con el resto de la interfaz.
			 */}
			{!autoplay.reducedMotion && (
				<button
					type="button"
					onClick={autoplay.toggle}
					className="mx-auto mt-4 flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-600 transition-colors hover:text-ink-950"
				>
					{autoplay.playing ? (
						<Pause className="size-3.5" />
					) : (
						<Play className="size-3.5" />
					)}
					{autoplay.playing
						? pageDemo.actions.pauseDemo
						: pageDemo.actions.playDemo}
				</button>
			)}
		</>
	);
}