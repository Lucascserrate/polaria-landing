import type { SVGProps } from 'react';

/**
 * Iconografía propia, trazo de 1.5 y esquinas redondeadas.
 *
 * En una página en blanco y negro cada icono compite con el texto, así que sólo
 * sobreviven los que hacen falta para leer una acción o una lista. Acá están
 * los cinco que usa la demo y ningún otro.
 *
 * Nota deliberada: no usamos el logotipo de WhatsApp ni el de Google. Son
 * marcas registradas y reproducirlas insinúa una afiliación que no existe —
 * exactamente lo que hace fracasar una revisión de Meta. Los servicios se
 * nombran en texto.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			{children}
		</svg>
	);
}

export const Check = (p: IconProps) => (
	<Icon {...p}>
		<path d="m4.5 12.5 5 5 10-11" />
	</Icon>
);

/** Cerrar un panel. El único que lleva `aria-label`, porque no tiene texto. */
export const Close = (p: IconProps) => (
	<Icon {...p}>
		<path d="M6 6l12 12M18 6L6 18" />
	</Icon>
);

/**
 * Pausar. Va con `Reproducir`: el botón de la demostración cambia de icono y de
 * texto, y un icono solo no se anuncia.
 */
export const Pause = (p: IconProps) => (
	<Icon {...p}>
		<path d="M10 6v12M14 6v12" />
	</Icon>
);

/** Reproducir. Cerrado y a 1.5 de trazo, como el resto: relleno se ve pesado. */
export const Play = (p: IconProps) => (
	<Icon {...p}>
		<path d="M9 6.5 18 12l-9 5.5v-11Z" />
	</Icon>
);

export const CalendarCheck = (p: IconProps) => (
	<Icon {...p}>
		<path d="M4.5 8.5h15M7.5 3.5v3M16.5 3.5v3" />
		<path d="M5.5 5.5h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" />
		<path d="m9 14.5 2 2 4-4.5" />
	</Icon>
);