'use client';

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type RefObject,
} from 'react';
import { slotsForSelection, type BookableDay } from '../business-status';
import { demoBusiness } from '../content';
import type { DemoBooking } from '../use-demo-booking';

/** Los tiempos del ciclo, de punta a punta, en milisegundos. */
const TIMELINE = {
	/** Arriba, quieta, antes de que empiece a bajar. */
	HOLD_TOP_MS: 1200,
		/** El primer tramo, que es el que se lee. */
		SLOW_SCROLL_MS: 3500,
		/** El resto, de una. */
	FAST_SCROLL_MS: 1800,
	/** Abajo, con el botón de reservar a la vista. */
	HOLD_BOTTOM_MS: 800,
	/** Volver arriba: hasta el panel recién abierto o hasta el comprobante. */
	SCROLL_TO_PANEL_MS: 1200,
	/** Apuntar un botón que no está en el centro de la pantalla. */
	SCROLL_TO_TARGET_MS: 500,
	/** Cuánto se espera a que el botón que se acaba de abrir esté en la pantalla. */
	WAIT_TARGET_MS: 1200,
	/** Cada cuánto se mira si apareció. */
	POLL_MS: 50,
	/** Mirar lo que se acaba de apretar. */
	PICK_MS: 800,
	/** Lo que dura el anillo del toque. */
	TAP_MS: 450,
	/** El comprobante, antes de que el ciclo vuelva a empezar. */
	HOLD_SUMMARY_MS: 5000,
	/** Sin que nadie toque nada, la demostración vuelve a la carga. */
	IDLE_RESTART_MS: 10000,
} as const;

/** Qué tanto del recorrido se hace despacio: el resto entra de golpe. */
const SLOW_SCROLL_RATIO = 0.45;

	/** El aire que se deja arriba del elemento al que se baja. */
	const TARGET_OFFSET = 12;
	/** Margen para considerar si un elemento está "cómodo a la vista" (la barra sticky de abajo lo tapa) */
	const VISIBLE_MARGIN = 64;

/** El atributo que se le pone al elemento apretado mientras dura el anillo. */
const TAP_ATTR = 'data-demo-tap';

/**
 * El anillo, como el keyframe propio de la demo de WhatsApp: no depende del
 * plugin de animación de Tailwind. Sobrio a propósito —un borde de 2px que se
 * abre y se borra— porque la pantalla ya está llena de negro y de píldoras.
 *
 * Es un atributo y no una clase a propósito: al apretar, el chip elegido cambia
 * de `className` y React reescribe el atributo entero, con lo que una clase
 * agregada desde afuera se pierde en el mismo cuadro en que aparece el estado
 * nuevo.
 */
export const TAP_CSS = `
	@keyframes demoTap {
		from { box-shadow: 0 0 0 2px rgb(10 10 10 / 0.32); opacity: 1; }
		to { box-shadow: 0 0 0 12px rgb(10 10 10 / 0); opacity: 0; }
	}
	[data-demo-tap] { position: relative; }
	[data-demo-tap]::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: 0 0 0 2px rgb(10 10 10 / 0.32);
		animation: demoTap ${TIMELINE.TAP_MS}ms ease-out both;
		pointer-events: none;
	}
	@media (prefers-reduced-motion: reduce) {
		[data-demo-tap]::after { animation: none; opacity: 0; }
	}
`;

const RESERVE_NOW = '[data-demo="reservar-ahora"]';
const CONFIRM = '[data-demo="confirmar"]';
const SUMMARY = '[data-demo="comprobante"]';

const serviceDemo = (id: string) => `[data-demo="servicio-${id}"]`;
const dayDemo = (iso: string) => `[data-demo="dia-${iso}"]`;
const timeDemo = (time: string) => `[data-demo="hora-${time}"]`;

/** Entra y sale despacio, como el `smooth` del navegador pero con duración fija. */
function easeInOut(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Si la máquina pidió menos movimiento.
 *
 * Va por `useSyncExternalStore` y no en un estado porque es una fuente externa
 * que puede cambiar cuando el sistema la cambie, y porque el servidor no la
 * conoce: el snapshot del servidor es "no reducido", que es lo único que se
 * puede pintar en el HTML.
 */
function useReducedMotion(): boolean {
	const subscribe = useCallback((onChange: () => void) => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	}, []);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		() => false,
	);
}

export function useDemoAutoplay({
	booking,
	days,
	frameRef,
}: {
	booking: DemoBooking;
	days: BookableDay[];
	/** El marco del teléfono: lo que se mira para saber si está a la vista y lo que escucha las pulsaciones. */
	frameRef: RefObject<HTMLElement | null>;
}) {
	const [playing, setPlaying] = useState(true);
	const [visible, setVisible] = useState(true);
	const idleTimer = useRef<number | undefined>(undefined);
	/** Si la frenó el botón de afuera, y no una pulsación en el teléfono. */
	const pausedByHand = useRef(false);

	const reducedMotion = useReducedMotion();
	/*
	 * La pregunta que hacen el botón y el ciclo. Con movimiento reducido no hay
	 * reproducción automática: la demostración queda quieta e interactiva, y no
	 * hay botón que mostrar porque no hay nada que pausar.
	 */
	const active = playing && !reducedMotion;

	/*
	 * `booking` y `days` se recrean en cada render. Si el ciclo los leyera de las
	 * props, cada cambio de estado reiniciaría la línea de tiempo y la
	 * demostración no llegaría nunca al comprobante. Este effect va antes que el
	 * del ciclo a propósito, para que el ref ya esté actualizado cuando arranque.
	 */
	const latest = useRef({ booking, days });
	useEffect(() => {
		latest.current = { booking, days };
	});

	const toggle = useCallback(() => {
		window.clearTimeout(idleTimer.current);
		pausedByHand.current = !playing;
		setPlaying(!playing);
	}, [playing]);

	// Fuera de pantalla no hay nadie mirando: se pausa, y al volver arranca de
	// nuevo desde el principio del ciclo.
	useEffect(() => {
		const frame = frameRef.current;
		if (!frame || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) setVisible(entry.isIntersecting);
			},
			{ threshold: 0.2 },
		);

		observer.observe(frame);
		return () => observer.disconnect();
	}, [frameRef]);

	/*
	 * Un dedo, una rueda o el teclado dentro del marco: la demostración se aparta
	 * y no toca lo que la persona haya hecho. Si no vuelve a pasar nada, a los
	 * `IDLE_RESTART_MS` se carga sola.
	 */
	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;

		const stepAside = () => {
			// Si la frenó el botón de afuera, el dedo no la vuelve a prender por
			// debajo: eso lo decide el botón y sólo el botón.
			if (pausedByHand.current) return;

			setPlaying(false);
			window.clearTimeout(idleTimer.current);
			idleTimer.current = window.setTimeout(() => {
				idleTimer.current = undefined;
				setPlaying(true);
			}, TIMELINE.IDLE_RESTART_MS);
		};

		const events = ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const;
		for (const event of events) {
			frame.addEventListener(event, stepAside, { passive: true });
		}

		return () => {
			for (const event of events) frame.removeEventListener(event, stepAside);
		};
	}, [frameRef]);

	/*
	 * El timer de reanudar es del hook y no del effect de arriba. Si lo limpiara
	 * ese cleanup, se llevaría por delante el timer que `stepAside` acaba de
	 * armar, porque el cleanup corre justo después de que la demostración se
	 * frena.
	 */
	useEffect(
		() => () => {
			window.clearTimeout(idleTimer.current);
		},
		[],
	);

	// El ciclo. Vive en un effect y no en un estado: `active` y `visible` son lo
	// único que lo prende y lo apaga, y el cleanup es lo único que lo corta.
	useEffect(() => {
		if (!active || !visible) return;

		/*
		 * La preferencia se vuelve a leer acá. Durante la hidratación el snapshot es
		 * el del servidor, que es "no reducido", y esta línea es la que garantiza
		 * que en una máquina que pidió no mover nada no se mueva nada.
		 */
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const screen = frameRef.current?.querySelector<HTMLElement>(
			'[data-phone-screen]',
		);
		if (!screen) return;

		let alive = true;
		// Todo lo que se está esperando —un timeout o un cuadro— se anota acá para
		// que cancelar la animación lo despierte y la cadena termine sola.
		const pending = new Set<() => void>();

		// El botón que tiene el anillo puesto, si hay uno. Se recuerda para
		// sacárselo si la demostración se frena con el dedo encima: un botón con el
		// anillo congelado parece un botón roto.
		let ringing: HTMLElement | null = null;
		const unring = () => {
			ringing?.removeAttribute(TAP_ATTR);
			ringing = null;
		};

		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				function cancel() {
					window.clearTimeout(id);
					pending.delete(cancel);
					resolve();
				}

				const id = window.setTimeout(() => {
					pending.delete(cancel);
					resolve();
				}, ms);

				pending.add(cancel);
			});

		const scrollTo = (top: number, ms: number) =>
			new Promise<void>((resolve) => {
				/*
				 * Cancelar el scroll suave que haya podido arrancar el panel al
				 * abrirse: escribir con `behavior: 'auto'` interrumpe el nativo, y
				 * si no, los dos se pelean por el mismo `scrollTop`.
				 */
				screen.scrollTo({ top: screen.scrollTop, behavior: 'auto' });

				const from = screen.scrollTop;
				const delta = top - from;
				let raf = 0;

				function cancel() {
					window.cancelAnimationFrame(raf);
					pending.delete(cancel);
					resolve();
				}

				if (ms <= 0 || Math.abs(delta) < 1) {
					screen.scrollTop = top;
					resolve();
					return;
				}

				const started = performance.now();

				const tick = (now: number) => {
					const done = Math.min(1, (now - started) / ms);
					screen.scrollTop = from + delta * easeInOut(done);
					if (done < 1) {
						raf = window.requestAnimationFrame(tick);
						return;
					}
					pending.delete(cancel);
					resolve();
				};

				raf = window.requestAnimationFrame(tick);
				pending.add(cancel);
			});

		/** Cuánto se puede bajar: el scroll de arriba, medido contra el alto real. */
		const reach = () => Math.max(0, screen.scrollHeight - screen.clientHeight);

		/**
		 * El elemento tiene que estar en la pantalla antes de poder apretarlo.
		 *
		 * React confirma el estado que acaba de cambiar en el mismo cuadro o en el
		 * siguiente, así que después de un `action()` el botón que se acaba de abrir
		 * todavía puede no estar. Se lo espera en vez de dar el ciclo por terminado:
		 * sin esto, abrir el panel apagaba la demostración.
		 */
		const waitForTarget = async (
			selector: string,
			budget: number = TIMELINE.WAIT_TARGET_MS,
		) => {
			const deadline = performance.now() + budget;

			for (;;) {
				const found = screen.querySelector<HTMLElement>(selector);
				if (found || !alive || performance.now() > deadline) return found;
				await wait(TIMELINE.POLL_MS);
			}
		};

		const scrollToTarget = async (
			selector: string,
			ms: number = TIMELINE.SCROLL_TO_TARGET_MS,
			options: { onlyIfHidden?: boolean } = {},
		) => {
			const { onlyIfHidden = false } = options;
			const target = await waitForTarget(selector);
			if (!target || !alive) return null;

			// El mismo cálculo que `scrollWithinScreen`, con `scrollTop` en vez de
			// `scrollIntoView`: esto mueve la pantalla del teléfono, no la landing.
			const screenRect = screen.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();

			if (onlyIfHidden) {
				const visible = targetRect.top >= screenRect.top + VISIBLE_MARGIN &&
					targetRect.bottom <= screenRect.bottom - VISIBLE_MARGIN;
				if (visible) return target;
			}

			const top =
				targetRect.top -
				screenRect.top +
				screen.scrollTop -
				TARGET_OFFSET;

			await scrollTo(top, ms);
			return target;
		};

		/**
		 * Apuntar el elemento, poner el anillo y ejecutar la acción.
		 *
		 * El anillo va antes que la acción y no al revés: es lo que hace un dedo,
		 * y "Reservar ahora" desaparece en el mismo cuadro en que se lo aprieta —
		 * con la acción primero, el botón se desarma antes de que el anillo llegue a
		 * dibujarse.
		 */
		const press = async (selector: string, action: () => void) => {
			const target = await scrollToTarget(selector, TIMELINE.SCROLL_TO_TARGET_MS, { onlyIfHidden: true });
			if (!target || !alive) return false;

			target.setAttribute(TAP_ATTR, '');
			ringing = target;
			await wait(TIMELINE.TAP_MS);
			if (!alive) {
				unring();
				return false;
			}

			action();
			unring();
			return true;
		};

		const cycle = async () => {
			const { booking: b, days: bookable } = latest.current;
			const service = demoBusiness.services[0];
			const day = bookable[0];
			if (!service || !day) return false;

			// Arriba de nuevo. Si veníamos de un resumen, primero se cierra.
			if (latest.current.booking.state.step !== 'closed' || screen.scrollTop > 1) {
				latest.current.booking.reset();
				await scrollTo(0, TIMELINE.SCROLL_TO_PANEL_MS);
				if (!alive) return false;
			}

			// 1. Quieta arriba, como recién abierta.
			await wait(TIMELINE.HOLD_TOP_MS);
			if (!alive) return false;

			// 2. El primer tramo, despacio.
			await scrollTo(reach() * SLOW_SCROLL_RATIO, TIMELINE.SLOW_SCROLL_MS);
			if (!alive) return false;

			// 3. El resto, rápido, y una pausa abajo con el botón a la vista.
			await scrollTo(reach(), TIMELINE.FAST_SCROLL_MS);
			await wait(TIMELINE.HOLD_BOTTOM_MS);
			if (!alive) return false;

			/*
			 * 5 antes que 4, y no al revés: "Reservar ahora" es la barra de abajo y
			 * arriba no está. Apretar un botón fuera de pantalla no se ve, así que
			 * el toque va primero y el scroll de vuelta —el 4— es el que sube
			 * recién abierto el panel, que quedó arriba.
			 */
			if (!(await press(RESERVE_NOW, b.open))) return false;

			// 4. Arriba, hasta el panel.
			if (!(await scrollToTarget(serviceDemo(service.id), TIMELINE.SCROLL_TO_PANEL_MS)))
				return false;
			await wait(TIMELINE.PICK_MS);
			if (!alive) return false;

			// 6. Un servicio: el primero de la lista, como si fuera el primero que
			// se ve.
			if (!(await press(serviceDemo(service.id), () => b.toggleService(service.id))))
				return false;
			await wait(TIMELINE.PICK_MS);
			if (!alive) return false;

			// 7. El primer día con atención.
			if (!(await press(dayDemo(day.iso), () => b.chooseDay(day.iso)))) return false;
			await wait(TIMELINE.PICK_MS);
			if (!alive) return false;

			await wait(TIMELINE.PICK_MS * 1.5);
			if (!alive) return false;
			const balayage = demoBusiness.services.find((s) => s.id === 'balayage');
			if (!balayage) return false;
			if (!(await press(serviceDemo(balayage.id), () => b.toggleService(balayage.id)))) return false;
			await wait(TIMELINE.PICK_MS);
			if (!alive) return false;

			// 8. Una hora del medio de la grilla, no la primera: la de la punta
			// siempre está más cerca del borde y se ve peor.
			const { serviceIds } = latest.current.booking.state;
			const slots = slotsForSelection(demoBusiness.services, serviceIds, day);
			const slot = slots[Math.floor(slots.length / 2)];
			if (!slot) return false;
			if (!(await press(timeDemo(slot), () => b.chooseTime(slot)))) return false;
			await wait(TIMELINE.PICK_MS);
			if (!alive) return false;

			// 9. Confirmar, y el comprobante a la vista.
			if (!(await press(CONFIRM, b.confirm))) return false;
			await scrollToTarget(SUMMARY, TIMELINE.SCROLL_TO_PANEL_MS);

			// 10. El comprobante se mira un rato y el ciclo vuelve a empezar.
			await wait(TIMELINE.HOLD_SUMMARY_MS);
			return true;
		};

		void (async () => {
			while (alive) {
				const completed = await cycle();
				if (!alive) return;

				/*
				 * Un paso que no encuentra su botón deja la demostración apagada. Es
				 * mejor eso que un ciclo que se repite sin hacer nada: si el marcado
				 * cambia, se nota en el botón de pausa y no en un teléfono que
				 * parpadea.
				 */
				if (!completed) {
					setPlaying(false);
					return;
				}
			}
		})();

		return () => {
			alive = false;
			unring();
			for (const cancel of [...pending]) cancel();
			pending.clear();
		};
	}, [frameRef, active, visible]);

	return { playing: active, reducedMotion, toggle };
}