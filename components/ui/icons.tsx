import type { SVGProps } from 'react';

/**
 * Iconografía propia, trazo de 1.5 y esquinas redondeadas.
 *
 * En una página en blanco y negro cada icono compite con el texto, así que sólo
 * sobreviven los que hacen falta para leer una acción o una lista.
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
