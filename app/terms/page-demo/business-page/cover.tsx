import Image from 'next/image';

import { demoBusiness } from '@/content/page-demo';

const business = demoBusiness;

/** La portada: la primera foto, a todo el ancho de la pantalla. */
export const cover = business.gallery[0];

export function Cover() {
	if (!cover) return null;

	return (
		<figure className="relative aspect-square bg-paper-200">
			<Image
				src={cover.src}
				alt={cover.alt}
				fill
				priority
				sizes="21rem"
				className="object-cover"
			/>
		</figure>
	);
}
