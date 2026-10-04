import { cn } from '@/lib/utils';
import { demoBusiness } from '@/content/page-demo';

const business = demoBusiness;

/**
 * El mapa del negocio, con OpenStreetMap.
 *
 * OSM y no Mapbox como en el producto porque no pide credencial: la landing no
 * tiene variables de entorno y una clave faltante dejaría la sección sin mapa.
 * El encuadre se arma con un `bbox` porque el `embed` no acepta un centro con
 * zoom, y la atribución la pone el mismo embed.
 */
export function LocationMap({ className }: { className?: string }) {
	return (
		<iframe
			title={`Mapa de la ubicación de ${business.name}`}
			src={`https://www.openstreetmap.org/export/embed.html?bbox=${business.longitude - 0.01}%2C${business.latitude - 0.006}%2C${business.longitude + 0.01}%2C${business.latitude + 0.006}&layer=mapnik&marker=${business.latitude}%2C${business.longitude}`}
			className={cn('border-0', className)}
			loading="lazy"
		/>
	);
}
