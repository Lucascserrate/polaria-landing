import { demoBusiness, pageDemo } from '../content';
import { directionsLabel } from './page-header';
import { LocationMap } from './location-map';

const business = demoBusiness;
const labels = pageDemo.labels;

/** La ubicación: el mapa, la dirección y el enlace para abrirla en Google Maps. */
export function Location() {
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		business.address,
	)}`;

	return (
		<section
			id="demo-ubicacion"
			aria-labelledby="ubicacion"
			className="space-y-4"
		>
			<h4 id="ubicacion" className="text-xl font-semibold text-ink-950">
				{labels.location}
			</h4>

			<div className="overflow-hidden rounded-2xl ring-1 ring-inset ring-paper-300">
				<LocationMap className="aspect-2/1 w-full" />

				<div className="space-y-2 px-4 py-4">
					<p className="text-sm leading-relaxed text-ink-900">
						{business.address}
					</p>

					<a
						href={mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
					>
						{directionsLabel}
					</a>
				</div>
			</div>
		</section>
	);
}
