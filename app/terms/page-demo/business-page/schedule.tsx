import { cn } from '@/lib/utils';
import { demoBusiness, pageDemo, weekdayNames, weekOrder } from '@/content/page-demo';

const business = demoBusiness;
const labels = pageDemo.labels;

/**
 * Los horarios: los siete días, lunes primero y domingo último como en el
 * producto. El de hoy se resalta porque la pregunta no es sólo qué días atiende
 * el local sino qué día es hoy.
 */
export function Schedule({ today }: { today: number }) {
	return (
		<section aria-labelledby="horarios" className="space-y-4">
			<h4 id="horarios" className="text-xl font-semibold text-ink-950">
				{labels.schedule}
			</h4>

			<ul className="divide-y divide-paper-300 overflow-hidden rounded-2xl ring-1 ring-inset ring-paper-300">
				{weekOrder.map((dayOfWeek) => {
					const isToday = dayOfWeek === today;
					const range = business.hours.find(
						(day) => day.dayOfWeek === dayOfWeek,
					);

					return (
						<li
							key={dayOfWeek}
							className={cn(
								'flex items-baseline justify-between gap-3 px-4 py-2.5',
								isToday && 'bg-paper-100',
							)}
						>
							<span className={cn(isToday ? 'font-semibold' : 'text-ink-700')}>
								<span className="capitalize">{weekdayNames[dayOfWeek]}</span>
								{isToday && (
									<span className="ml-2 text-xs font-normal text-ink-500">
										{labels.today}
									</span>
								)}
							</span>

							<span
								className={cn(
									'text-sm tabular-nums',
									isToday && !range ? 'text-ink-500' : 'text-ink-900',
								)}
							>
								{range
									? `${range.startTime} – ${range.endTime}`
									: labels.closed}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
