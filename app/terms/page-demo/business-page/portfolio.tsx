import Image from 'next/image';

import { cn } from '@/lib/utils';
import { demoBusiness, pageDemo } from '@/content/page-demo';

const business = demoBusiness;
const labels = pageDemo.labels;

export function Portfolio() {
	/*
	 * El mosaico del producto: la primera foto ocupa 2x2 y el resto una celda. Con
	 * 3 fotos son tres columnas, con 5 o más cuatro; con 1, 2 o 4 no hay forma
	 * limpia y se muestran de a dos.
	 */
	const count = business.portfolio.length;
	const mosaic = count === 3 || count >= 5;
	const columns =
		count >= 5 ? 'grid-cols-4' : count === 3 ? 'grid-cols-3' : 'grid-cols-2';

	return (
		<section aria-labelledby="portfolio" className="space-y-4">
			<h4
				id="portfolio"
				className="flex items-center gap-2 text-xl font-semibold text-ink-950"
			>
				{labels.portfolio}
				<span className="rounded-full px-2 py-0.5 text-xs font-medium tabular-nums text-ink-600 ring-1 ring-inset ring-paper-300">
					{business.portfolio.length}
				</span>
			</h4>

			<ul className={cn('grid gap-2', columns)}>
				{business.portfolio.map((photo, index) => (
					<li
						key={photo.id}
						className={cn(
							'relative overflow-hidden rounded-xl bg-paper-200',
							mosaic && index === 0 ? 'col-span-2 row-span-2' : 'aspect-square',
						)}
					>
						<Image
							src={photo.src}
							alt={photo.alt}
							fill
							sizes={mosaic && index === 0 ? '14rem' : '8rem'}
							className="object-cover"
						/>
					</li>
				))}
			</ul>
		</section>
	);
}
