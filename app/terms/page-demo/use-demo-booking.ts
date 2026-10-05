'use client';

import { useReducer } from 'react';

/**
 * La reserva de la demostración, entera y en memoria: sin API, sin sesión y sin
 * React Query, el estado nace acá y muere con la página.
 *
 * Un `useReducer` con acciones nombradas y no un `useState` por campo, como en el
 * producto: con piezas que dependen unas de otras, la acción deja explícita la
 * transición en un solo lugar.
 */

export type DemoStep = 'closed' | 'choosing' | 'done';

export type DemoState = {
	step: DemoStep;
	serviceIds: string[];
	dayIso: string | null;
	time: string | null;
};

type Action =
	| { type: 'open' }
	| { type: 'close' }
	| { type: 'chooseService'; id: string }
	| { type: 'toggleService'; id: string }
	| { type: 'chooseDay'; iso: string }
	| { type: 'chooseTime'; time: string }
	| { type: 'confirm' }
	| { type: 'reset' };

const initial: DemoState = {
	step: 'closed',
	serviceIds: [],
	dayIso: null,
	time: null,
};

function reducer(state: DemoState, action: Action): DemoState {
	switch (action.type) {
		case 'open':
			if (state.step === 'closed') return { ...state, step: 'choosing' };
			return state;

		case 'close':
			return { ...state, step: 'closed' };

		/*
		 * Reservar desde la fila deja ese servicio elegido y borra día y hora: se
		 * calcularon para otra duración, así que dejarlos ofrecería un turno que no
		 * existe.
		 */
		case 'chooseService':
			return {
				step: 'choosing',
				serviceIds: [action.id],
				dayIso: null,
				time: null,
			};

		case 'toggleService': {
			const serviceIds = state.serviceIds.includes(action.id)
				? state.serviceIds.filter((id) => id !== action.id)
				: [...state.serviceIds, action.id];

			return { ...state, serviceIds, time: null };
		}

		case 'chooseDay':
			return { ...state, dayIso: action.iso, time: null };

		case 'chooseTime':
			return { ...state, time: action.time };

		case 'confirm':
			// Sin turno completo no se puede confirmar: el botón está apagado, pero el
			// reducer no confía en eso.
			if (!state.dayIso || !state.time) return state;
			return { ...state, step: 'done' };

		case 'reset':
			return initial;
	}
}

export function useDemoBooking() {
	const [state, dispatch] = useReducer(reducer, initial);

	return {
		state,
		open: () => dispatch({ type: 'open' }),
		close: () => dispatch({ type: 'close' }),
		chooseService: (id: string) => dispatch({ type: 'chooseService', id }),
		toggleService: (id: string) => dispatch({ type: 'toggleService', id }),
		chooseDay: (iso: string) => dispatch({ type: 'chooseDay', iso }),
		chooseTime: (time: string) => dispatch({ type: 'chooseTime', time }),
		confirm: () => dispatch({ type: 'confirm' }),
		reset: () => dispatch({ type: 'reset' }),
	};
}

/** Lo que devuelve `useDemoBooking`, para pasarlo como prop sin escribir el `ReturnType` en cada componente. */
export type DemoBooking = ReturnType<typeof useDemoBooking>;
