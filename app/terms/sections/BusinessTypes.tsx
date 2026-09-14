'use client';

import Image from 'next/image';

import { businessTypes } from '../data';
import { SectionTitle } from '../shared/Section';
import { useReveal } from '../shared/useReveal';

export function BusinessTypes() {
	const { ref, isVisible, reduceMotion } = useReveal<HTMLDivElement>();

	return (
		<section className="px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<SectionTitle
					title="Pensado para tu rubro, sea cual sea."
					description="Desde barberías hasta clínicas dentales, Polaria se adapta al flujo de citas de tu negocio."
				/>
				<div
					ref={ref}
					className={`mt-10 rounded-[2rem] border border-neutral-200 bg-white p-6 transition-all duration-400 ease-out sm:p-8 motion-reduce:transition-none ${isVisible || reduceMotion ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0'}`}
				>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{businessTypes.map((item, index) => (
							<div
								key={item.label}
								className={`group relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-neutral-100 transition-all duration-400 ease-out motion-reduce:transition-none ${isVisible || reduceMotion ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0'}`}
								style={{ transitionDelay: `${index * 60}ms` }}
							>
								<Image
									src={item.image}
									alt={item.label}
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
								/>
								<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 via-black/15 to-transparent px-5 pb-4 pt-12">
									<p className="text-sm font-medium text-white">{item.label}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
