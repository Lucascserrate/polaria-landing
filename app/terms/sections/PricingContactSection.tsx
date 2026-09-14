import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/config/cta';

export function PricingContactSection() {
	return (
		<section id="precios" className="px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl rounded-[2rem] border border-neutral-200 bg-neutral-50 px-6 py-10 text-center sm:px-10">
				<h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
					¿Cuánto cuesta Polaria?
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
					Cada negocio tiene su propia forma de trabajar. Escribinos por WhatsApp y
					te contamos el plan disponible, cómo funciona y cómo ponerlo en marcha
					para tu equipo.
				</p>
				<Button asChild className="mt-6 h-11 rounded-full bg-neutral-950 px-6 text-white hover:bg-neutral-800">
					<Link href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
						Consultar por WhatsApp
					</Link>
				</Button>
			</div>
		</section>
	);
}
