import Image from 'next/image';

import { cn } from '../cn';
import { demoBusiness, initials, pageDemo } from '../content';

const business = demoBusiness;
const labels = pageDemo.labels;

export function Team() {
	return (
		<section aria-labelledby="equipo" className="space-y-4">
			<h4 id="equipo" className="text-xl font-semibold text-ink-950">
				{labels.team}
			</h4>

			<ul className="grid grid-cols-2 gap-x-3 gap-y-5">
				{business.team.map((member) => (
					<li
						key={member.id}
						className="flex min-w-0 flex-col items-center gap-2"
					>
						<span
							aria-hidden
							className={cn(
								'relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-paper-200 text-3xl font-medium text-ink-600',
								member.photo && 'text-ink-600/0',
							)}
						>
							{member.photo ? (
								<Image
									src={member.photo}
									alt=""
									fill
									sizes="6rem"
									className="object-cover"
								/>
							) : (
								initials(member.name)
							)}
						</span>

						<div className="w-full min-w-0 text-center">
							<p className="truncate font-medium text-ink-950">{member.name}</p>
							{member.jobTitle && (
								<p className="truncate text-sm text-ink-500">
									{member.jobTitle}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
