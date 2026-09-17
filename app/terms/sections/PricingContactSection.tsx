import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/config/cta';

export function PricingContactSection() {
	return (
		<section id="precios" className="px-4 py-14 sm:px-6 lg:px-8">
			<div className="pricing-contact mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-neutral-200 bg-neutral-950 px-6 py-14 text-center text-white sm:px-10 lg:px-16">
				<h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tighter sm:text-5xl">
					¿Cuánto cuesta Polaria?
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
					Cada negocio tiene su propia forma de trabajar. Escribinos por WhatsApp y
					te contamos el plan disponible, cómo funciona y cómo ponerlo en marcha
					para tu equipo.
				</p>
				<div className="mt-8">
					<Button
						asChild
						className="h-11 rounded-full bg-white px-6 text-neutral-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-lg active:translate-y-0"
					>
						<Link href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
							Consultar por WhatsApp
						</Link>
					</Button>
				</div>
			</div>

			<style>{`
				.pricing-contact {
					background-image: radial-gradient(
						circle at 50% 115%,
						rgba(255, 255, 255, 0.08),
						transparent 34%
					);
					animation: ctaGlow 8s ease-in-out infinite;
				}

				@keyframes ctaGlow {
					0%, 100% {
						background-position: 50% 115%;
					}

					50% {
						background-position: 50% 108%;
					}
				}

				@media (prefers-reduced-motion: reduce) {
					.pricing-contact {
						animation: none;
					}
				}
			`}</style>
		</section>
	);
}