import type { BusinessStatus, DemoDay } from './content';

function toMinutes(time: string): number {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
}

function toClock(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

type ZonedNow = {
	dayOfWeek: number;
	minutes: number;
	year: number;
	month: number;
	day: number;
};

/**
 * El instante actual en la zona del negocio. El día se deriva de `Date.UTC` sobre
 * las partes ya traducidas, y no del `weekday` de `Intl`: es lo que evita mapear
 * nombres de días de un locale, que es de donde salen los errores aquí.
 */
function zonedNow(timeZone: string, now: Date): ZonedNow {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).formatToParts(now);

	const value = (type: Intl.DateTimeFormatPartTypes): number =>
		Number(parts.find((part) => part.type === type)?.value ?? 0);

	const date = new Date(
		Date.UTC(value('year'), value('month') - 1, value('day')),
	);

	return {
		dayOfWeek: date.getUTCDay(),
		minutes: value('hour') * 60 + value('minute'),
		year: value('year'),
		month: value('month'),
		day: value('day'),
	};
}

function rangeFor(hours: DemoDay[], dayOfWeek: number): DemoDay | undefined {
	return hours.find((day) => day.dayOfWeek === dayOfWeek);
}

export type { BusinessStatus } from './content';

/**
 * Si el negocio está abierto **ahora**. Es la primera línea de la página pública:
 * quien llega desde un enlace quiere saber si puede pasar hoy. No puede ser texto
 * fijo, o un domingo a las diez diría "Abierto".
 */
export function resolveStatus(
	hours: DemoDay[],
	timeZone: string,
	now: Date,
): BusinessStatus {
	const today = zonedNow(timeZone, now);
	const todayRange = rangeFor(hours, today.dayOfWeek);

	if (
		todayRange &&
		today.minutes >= toMinutes(todayRange.startTime) &&
		today.minutes < toMinutes(todayRange.endTime)
	) {
		return {
			open: true,
			time: todayRange.endTime,
			dayOfWeek: null,
			daysAhead: null,
		};
	}

	for (let ahead = 0; ahead < 7; ahead += 1) {
		const dayOfWeek = (today.dayOfWeek + ahead) % 7;
		const range = rangeFor(hours, dayOfWeek);
		if (!range) continue;

		// Hoy puede quedar una franja más adelante: un local que abre a la tarde está
		// cerrado a las diez de la mañana, pero no por el día entero.
		const start = toMinutes(range.startTime);
		if (ahead === 0 && start <= today.minutes) continue;

		return { open: false, time: range.startTime, dayOfWeek, daysAhead: ahead };
	}

	return { open: false, time: null, dayOfWeek: null, daysAhead: null };
}

export function currentDayOfWeek(timeZone: string, now: Date): number {
	return zonedNow(timeZone, now).dayOfWeek;
}

export type BookableDay = {
	iso: string;
	dayOfWeek: number;
	dayOfMonth: number;
	startTime: string;
	endTime: string;
};

/**
 * Los próximos días con atención, en orden. No son los próximos siete del
 * calendario sino los siete que el negocio atiende: el domingo no aparece, al
 * revés que en la lista de horarios, que sí muestra los siete.
 */
export function upcomingDays(
	hours: DemoDay[],
	timeZone: string,
	now: Date,
	count: number,
): BookableDay[] {
	const today = zonedNow(timeZone, now);
	const days: BookableDay[] = [];
	for (let ahead = 0; ahead < 31 && days.length < count; ahead += 1) {
		const date = new Date(
			Date.UTC(today.year, today.month - 1, today.day + ahead),
		);
		const dayOfWeek = date.getUTCDay();
		const range = rangeFor(hours, dayOfWeek);
		if (!range) continue;

		days.push({
			iso: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
				date.getUTCDate(),
			).padStart(2, '0')}`,
			dayOfWeek,
			dayOfMonth: date.getUTCDate(),
			startTime: range.startTime,
			endTime: range.endTime,
		});
	}

	return days;
}

/**
 * Las horas que quedan el día elegido. La grilla depende de lo que se elija: dos
 * servicios de una hora no ofrecen las mismas horas que uno de media. El último
 * turno tiene que *terminar* antes del cierre.
 */
export function slotsFor(
	startTime: string,
	endTime: string,
	durationMinutes: number,
	stepMinutes = 30,
): string[] {
	const start = toMinutes(startTime);
	const end = toMinutes(endTime);
	const slots: string[] = [];

	if (durationMinutes <= 0 || durationMinutes > end - start) return slots;

	for (
		let minute = start;
		minute + durationMinutes <= end;
		minute += stepMinutes
	) {
		slots.push(toClock(minute));
	}

	return slots;
}

/**
 * La grilla del panel con lo que está elegido: servicio y día, en una sola
 * llamada. Existe para que el panel y la demostración automática miren la misma
 * grilla. Si el cálculo estuviera duplicado, la automática podría terminar
 * apretando un turno que el panel no ofrece.
 */
export function slotsForSelection(
	services: readonly { id: string; durationMinutes: number }[],
	selectedIds: readonly string[],
	day: BookableDay | undefined,
): string[] {
	if (!day) return [];
	return slotsFor(day.startTime, day.endTime, totalDuration(services, selectedIds));
}

export function totalDuration(
	services: readonly { id: string; durationMinutes: number }[],
	selectedIds: readonly string[],
): number {
	return services
		.filter((service) => selectedIds.includes(service.id))
		.reduce((total, service) => total + service.durationMinutes, 0);
}

export function totalPrice(
	services: readonly { id: string; price: number | null }[],
	selectedIds: readonly string[],
): number | null {
	let total = 0;

	for (const service of services) {
		if (!selectedIds.includes(service.id)) continue;
		if (service.price === null) return null;
		total += service.price;
	}

	return total;
}

export function dayLabel(
	day: BookableDay,
	weekdayNames: readonly string[],
	monthNames: readonly string[],
): string {
	const month = monthNames[Number(day.iso.slice(5, 7)) - 1];
	return `${weekdayNames[day.dayOfWeek]} ${day.dayOfMonth} de ${month}`;
}

export const monthNames = [
	'enero',
	'febrero',
	'marzo',
	'abril',
	'mayo',
	'junio',
	'julio',
	'agosto',
	'septiembre',
	'octubre',
	'noviembre',
	'diciembre',
] as const;
