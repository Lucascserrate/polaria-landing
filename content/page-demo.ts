export type DemoService = {
	id: string;
	name: string;
	description: string | null;
	durationMinutes: number;
	price: number | null;
};

export type DemoTeamMember = {
	id: string;
	name: string;
	jobTitle: string | null;
	photo: string | null;
};

export type DemoPhoto = {
	id: string;
	src: string;
	alt: string;
};

/** Una franja del horario semanal. `dayOfWeek`: 0 es domingo. */
export type DemoDay = {
	dayOfWeek: number;
	startTime: string;
	endTime: string;
};

/**
 * Si el negocio está abierto ahora, y si no, cuándo abre.
 *
 * Vive acá y no junto al cálculo porque es la forma en que el backend lo
 * devuelve —`business-status.ts` es el que lo arma, y esta pantalla es una de
 * las que lo consume—. Los datos y su forma en un lado, el razonamiento en el
 * otro.
 */
export type BusinessStatus = {
	open: boolean;
	/** `HH:MM` del cierre si está abierto; de la próxima apertura si no. */
	time: string | null;
	/** 0 = domingo. `null` si el negocio no abre ningún día. */
	dayOfWeek: number | null;
	/** 0 = hoy más tarde, 1 = mañana. `null` si está abierto. */
	daysAhead: number | null;
};

export type DemoBusiness = {
	slug: string;
	name: string;
	businessType: string;
	currency: string;
	timezone: string;
	address: string;
	/** Dónde abre el mapa. En `polaria-front` lo elige quien crea el negocio. */
	latitude: number;
	longitude: number;
	hours: DemoDay[];
	services: DemoService[];
	team: DemoTeamMember[];
	gallery: DemoPhoto[];
	portfolio: DemoPhoto[];
	importantInfo: string;
};

export const weekOrder = [1, 2, 3, 4, 5, 6, 0] as const;

export const weekdayNames = [
	'domingo',
	'lunes',
	'martes',
	'miércoles',
	'jueves',
	'viernes',
	'sábado',
] as const;

export const weekdayShort = [
	'dom',
	'lun',
	'mar',
	'mié',
	'jue',
	'vie',
	'sáb',
] as const;

export const pageDemo = {
	heading: {
		title: 'La página que ve tu cliente',
		lead: 'Es lo que abre quien tiene tu enlace: un QR pegado en el local, tu Instagram, la biografía de WhatsApp. Dice qué hacés, cuánto cuesta y a qué hora estás libre, y reserva sin escribirte. Acá podés probarla — es una demostración y no guarda nada.',
	},

	labels: {
		services: 'Servicios',
		schedule: 'Horarios',
		team: 'Equipo',
		portfolio: 'Portfolio',
		location: 'Ubicación',
		today: 'Hoy',
		closed: 'Cerrado',
	},

	/**
	 * El estado, con sus dos variantes.
	 *
	 * La página real distingue abierto de cerrado con un punto de color: ámbar
	 * cuando está cerrado y verde cuando está abierto. Acá va igual, porque esta
	 * pantalla es una foto del producto y no la landing: mentirle al cliente sobre
	 * el color sería mentirle sobre la página. El resto de la landing sigue siendo
	 * negro, blanco y dos grises.
	 */
	status: {
		open: 'Abierto',
		closed: 'Cerrado',
		until: 'cierra a las {time}',
		today: 'abre hoy a las {time}',
		tomorrow: 'abre mañana a las {time}',
		weekday: 'abre el {day} a las {time}',
	},

	actions: {
		reserve: 'Reservar',
		reserveNow: 'Reservar ahora',
		close: 'Cerrar',
		confirm: 'Confirmar turno',
		gotIt: 'Entendido',
		restart: 'Reiniciar la demostración',
	},

	booking: {
		title: 'Reserva tu turno',
		lead: 'Elegí un servicio, un día y una hora.',
		stepService: 'Servicio',
		stepDay: 'Día',
		stepTime: 'Hora',
		total: 'Total',
		duration: 'Duración',
		noSlots:
			'No quedan horarios ese día con esa combinación. Probá con otro día o con menos servicios.',
		priceOnSite: 'A confirmar en el local',
		done: {
			title: '¡Listo, tu turno quedó reservado!',
			lead: 'Podés sacar otro turno igual, si querés.',
			important: 'Información importante',
			disclaimer:
				'Es una demostración: no se reservó nada de verdad y no te vamos a escribir.',
		},
	},

	pageFooter: {
		poweredBy: 'Reservas con',
		product: 'Polaria',
	},

	counts: {
		one: '{n} servicio disponible',
		many: '{n} servicios disponibles',
	},
} as const;

/**
 * El negocio de ejemplo.
 *
 * Un salón de belleza de Bogotá con horario de lunes a sábado: el domingo
 * cerrado es lo que hace que el estado de la cabecera tenga algo real que
 * decir —"Cerrado · abre mañana a las 09:00"— en vez de un texto fijo.
 *
 * Las fotos salen de `public/pagina/`. Los servicios son de propósito dispares
 * en duración: si todos duraran lo mismo, cambiar la selección no cambiaría la
 * grilla de horas y la demostración no estaría enseñando nada.
 */
export const demoBusiness: DemoBusiness = {
	slug: 'prueba',
	name: 'Estudio Marea',
	businessType: 'Salón de belleza',
	currency: '$',
	timezone: 'America/Bogota',
	address: 'Carrera 13 # 52-30, Chapinero, Bogotá',
	latitude: 4.6489,
	longitude: -74.0646,
	hours: [
		{ dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
		{ dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
		{ dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
		{ dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
		{ dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
		{ dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
	],
	services: [
		{
			id: 'corte-clasico',
			name: 'Corte clásico',
			description: 'Perfilado, rebajado y diseño de formas.',
			durationMinutes: 30,
			price: 20000,
		},
		{
			id: 'coloracion',
			name: 'Coloración completa',
			description: 'Diagnóstico, lavado, aplicación y cuidado posterior.',
			durationMinutes: 90,
			price: 85000,
		},
		{
			id: 'balayage',
			name: 'Balayage',
			description: 'Diagnóstico, balayage, matiz y peinado.',
			durationMinutes: 120,
			price: 145000,
		},
		{
			id: 'manicure',
			name: 'Manicure y pedicure',
			description: 'Se cotiza según el estado de las uñas.',
			durationMinutes: 60,
			price: null,
		},
	],
	team: [
		{
			id: 'luis',
			name: 'Luis García',
			jobTitle: 'Estilista',
			photo: '/pagina/pexels-leonardokfn-7781850.jpg',
		},
		{
			id: 'camila',
			name: 'Camila Restrepo',
			jobTitle: 'Colorista',
			photo: null,
		},
		{
			id: 'juan',
			name: 'Juan Pérez',
			jobTitle: 'Barbero',
			photo: '/pagina/barbero.jpg',
		},
	],
	gallery: [
		{
			id: 'local',
			src: '/pagina/imagendellocal.jpg',
			alt: 'El salón del Estudio Marea.',
		},
	],
	portfolio: [
		{
			id: 'trabajo-1',
			src: '/pagina/corte1.jpg',
			alt: 'Corte de pelo terminado.',
		},
		{
			id: 'trabajo-2',
			src: '/pagina/corte2.jpg',
			alt: 'Corte de pelo terminado.',
		},
		{
			id: 'trabajo-3',
			src: '/pagina/corte3.jpg',
			alt: 'Corte de pelo terminado.',
		},
		{
			id: 'trabajo-4',
			src: '/pagina/corte4.jpg',
			alt: 'Corte de pelo terminado.',
		},
		{
			id: 'trabajo-5',
			src: '/pagina/corte5.png',
			alt: 'Corte de pelo terminado.',
		},
		{
			id: 'trabajo-6',
			src: '/pagina/corte6.jpg',
			alt: 'Corte de pelo terminado.',
		},
	],

	importantInfo:
		'Para confirmar tu turno necesitamos el 50% de anticipo. Mandanos el comprobante por WhatsApp.',
};

export function initials(name: string): string {
	return name
		.split(' ')
		.slice(0, 2)
		.map((word) => word[0] ?? '')
		.join('')
		.toUpperCase();
}

/**
 * El precio en pesos colombianos.
 *
 * El punto de miles se arma con una expresión regular y no con `Intl`: el
 * componente se renderiza en el servidor y en el navegador, y dos versiones de
 * ICU pueden no coincidir en cómo groupan. Si eso pasara, el mismo número
 * aparecería distinto en el HTML y en el hidratado y React lo marcaría como
 * error en la consola.
 */
export function formatPrice(amount: number, currency: string): string {
	const grouped = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return `${currency} ${grouped}`;
}

export function formatMinutes(minutes: number): string {
	return `${minutes} min`;
}

export function serviceCount(count: number): string {
	const template = count === 1 ? pageDemo.counts.one : pageDemo.counts.many;
	return template.replace('{n}', String(count));
}

/**
 * La línea de estado.
 *
 * Se arma acá y no en el componente porque es la frase más importante de la
 * pantalla y tiene tres variantes —"abre hoy", "abre mañana", "abre el
 * jueves"— que en el producto dependen del horario del negocio. Si el negocio no
 * tiene ninguna franja cargada no hay próxima apertura que anunciar, y la línea
 * queda en "Cerrado" a secas en vez de mentir con un día.
 */
export function formatStatus(status: BusinessStatus): string {
	const { open, time, dayOfWeek, daysAhead } = status;

	if (open && time) {
		return `${pageDemo.status.open} · ${pageDemo.status.until.replace('{time}', time)}`;
	}

	if (!time || dayOfWeek === null || daysAhead === null) {
		return pageDemo.status.closed;
	}

	const key =
		daysAhead === 0 ? 'today' : daysAhead === 1 ? 'tomorrow' : 'weekday';
	const text = pageDemo.status[key].replace('{time}', time);

	if (key === 'weekday') {
		return `${pageDemo.status.closed} · ${text.replace('{day}', weekdayNames[dayOfWeek])}`;
	}

	return `${pageDemo.status.closed} · ${text}`;
}
