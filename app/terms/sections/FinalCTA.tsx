import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
	return (
		<section className="px-4 py-14 sm:px-6 lg:px-8">
			<div className="final-cta mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-neutral-200 bg-neutral-950 px-6 py-14 text-center text-white sm:px-10 lg:px-16">
				<h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tighter sm:text-5xl">
					Empezá a organizar tu negocio hoy.
				</h2>

				<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
					Únete a cientos de salones, barberías y clínicas que ya confían en
					Polaria para escalar su negocio. Sin tarjetas de crédito requeridas.
				</p>

				<div className="mt-8">
					<Link href="https://app.polariahq.com/auth">
						<Button className="h-11 rounded-full bg-white px-6 text-neutral-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-lg active:translate-y-0">
							Crear cuenta gratis
						</Button>
					</Link>
				</div>
			</div>

			<style>{`
				.final-cta {
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
					.final-cta {
						animation: none;
					}
				}
			`}</style>
		</section>
	);
}
