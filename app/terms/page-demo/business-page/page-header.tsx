import { cn } from '@/lib/utils';
import {
	demoBusiness,
	formatStatus,
	type BusinessStatus,
} from '@/content/page-demo';

const business = demoBusiness;

/** El texto del enlace al mapa. Si prefieres, muévelo a `pageDemo.labels`. */
export const directionsLabel = 'Cómo llegar';

/**
 * La cabecera: nombre, rubro y estado. El estado lleva color como en la página
 * real —ámbar cerrado, verde abierto— y "Cómo llegar" salta a la ubicación.
 */
export function PageHeader({
	status,
	onDirections,
}: {
	status: BusinessStatus;
	onDirections: () => void;
}) {
	return (
		<header className="space-y-3">
			<div className="space-y-0.5">
				<h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink-950">
					{business.name}
				</h3>
				<p className="text-ink-500">{business.businessType}</p>
			</div>

			<p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
				<span className="inline-flex items-center gap-2">
					<span
						aria-hidden
						className={cn(
							'size-2 shrink-0 rounded-full',
							status.open ? 'bg-emerald-500' : 'bg-amber-500',
						)}
					/>
					<span
						className={cn(
							'font-medium',
							status.open ? 'text-emerald-700' : 'text-amber-700',
						)}
					>
						{formatStatus(status)}
					</span>
				</span>

				<button
					type="button"
					onClick={onDirections}
					className="cursor-pointer font-medium text-sky-700 transition-colors hover:text-sky-900"
				>
					{directionsLabel}
				</button>
			</p>
		</header>
	);
}
