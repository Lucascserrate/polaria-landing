'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '../shared/Section';

const faqs = [
	{
		question: '¿Qué pasa con la seguridad de mis datos?',
		answer:
			'Polaria está pensada para operar con datos de negocio de forma segura y con acceso por cuenta. Si luego querés, podemos ampliar esta sección con detalles concretos de cifrado y backups.',
	},
	{
		question: '¿Puedo cancelar cuando quiera?',
		answer:
			'Sí. Podés cambiar o cancelar tu plan sin permanencia, desde tu cuenta, en el momento que lo necesites.',
	},
	{
		question: '¿Incluye soporte?',
		answer:
			'El plan incluye soporte para ayudarte a configurar tu cuenta y resolver tus dudas.',
	},
	{
		question: '¿Pueden migrar mis datos?',
		answer:
			'Sí. Podemos ayudarte a migrar clientes, servicios y agenda para que el cambio sea lo más suave posible.',
	},
	{
		question: '¿Hay prueba gratuita?',
		answer:
			'Sí, puedes empezar sin tarjeta de crédito y evaluar el flujo principal antes de contratar el plan.',
	},
	{
		question: '¿Se integra con otras herramientas?',
		answer:
			'Sí. La idea es que la landing hable de integraciones reales o del flujo de uso. Si más adelante querés agregar integraciones específicas, esta sección queda lista para ampliarlas.',
	},
] as const;

function FaqCard({
	faq,
	isOpen,
	index,
	onToggle,
}: {
	faq: (typeof faqs)[number];
	isOpen: boolean;
	index: number;
	onToggle: () => void;
}) {
	return (
		<Card
			className={`rounded-[2rem] border-neutral-200 bg-white shadow-sm transition-shadow duration-300 ${
				isOpen ? 'shadow-xl' : ''
			}`}
		>
			<CardContent className="p-5">
				<button
					type="button"
					aria-expanded={isOpen}
					aria-controls={`faq-answer-${index}`}
					onClick={onToggle}
					className="flex w-full items-center justify-between gap-4 text-left text-lg font-medium tracking-[-0.03em] text-neutral-950"
				>
					<span>{faq.question}</span>

					<ChevronDown
						className={`size-4 shrink-0 text-neutral-400 transition-transform duration-300 motion-reduce:transition-none ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
				</button>

				<div
					className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
						isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
					}`}
					aria-hidden={!isOpen}
				>
					<div className="min-h-0 overflow-hidden">
						<div
							id={`faq-answer-${index}`}
							className="mt-3 max-h-28 overflow-y-auto pr-1"
						>
							<p className="text-sm leading-6 text-neutral-600">{faq.answer}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function FaqSection() {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	return (
		<section id="faq" className="px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<SectionTitle
					eyebrow="FAQ"
					title="Respuestas rápidas a las dudas más comunes."
					description="Una base simple para despejar objeciones antes de registrarse."
				/>

				<div className="mt-10 grid items-start gap-4 lg:grid-cols-2">
					{faqs.map((faq, index) => (
						<FaqCard
							key={faq.question}
							faq={faq}
							index={index}
							isOpen={openFaq === index}
							onToggle={() => setOpenFaq(openFaq === index ? null : index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
