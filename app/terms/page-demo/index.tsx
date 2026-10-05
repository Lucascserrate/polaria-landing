import { Reveal } from './reveal';
import { pageDemo } from './content';
import { PhoneDemo } from './phone-demo';

export function PageDemo() {
	return (
		<section
			id="pagina-del-cliente"
			aria-labelledby="page-demo-title"
			className="px-4 py-14 sm:px-6 lg:px-8"
		>
			<div className="mx-auto grid max-w-7xl gap-10 rounded-[2.25rem] border border-sky-200/60 bg-[#f4f8fc] p-5 sm:p-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
				<div>
					<h2
						id="page-demo-title"
						className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl"
					>
						{pageDemo.heading.title}
					</h2>
					<p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
						{pageDemo.heading.lead}
					</p>
				</div>

				<Reveal delay={80} className="mx-auto w-full max-w-md">
					<p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
						Demostración
					</p>
					<PhoneDemo />
				</Reveal>
			</div>
		</section>
	);
}
