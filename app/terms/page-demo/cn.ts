import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Copia local de `lib/utils.ts`, y no el import de la landing.
 *
 * La demo es una carpeta que se pega en otro proyecto: si `cn` viniera de
 * `@/lib/utils` habría que copiar también ese archivo, y con él la convención de
 * todo el sitio. Son cuatro líneas y las únicas dos dependencias que esto pide
 * por fuera son `clsx` y `tailwind-merge`, que ya están en cualquier proyecto
 * con Tailwind.
 *
 * El `twMerge` no es un detalle: hay llamadas con clases que se pisan entre sí
 * —`cn('grid gap-2', columns)`— y sin resolución de conflictos la que gana sería
 * siempre la última del atributo, no la que corresponde.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}