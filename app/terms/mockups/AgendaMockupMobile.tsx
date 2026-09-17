'use client';

import { useEffect, useRef, useState } from 'react';
import {
	BarChart3,
	CalendarDays,
	Ellipsis,
	LogOut,
	Scissors,
	Settings,
	UserRound,
	Users,
	X,
} from 'lucide-react';
import { Logo } from '@/app/logo';
import { agendaSidebarItems, type AgendaSection } from '../data';
import {
	AgendaView,
	AnalyticsView,
	ClientsView,
	ServicesView,
	SettingsView,
	StaffView,
} from './AgendaMockup';

const AUTO_INTERVAL_MS = 1200;
const RESUME_AFTER_IDLE_MS = 3000;

// Accesos directos visibles siempre en la barra inferior
const PRIMARY_SECTIONS = ['agenda', 'clientes', 'analiticas'] as const;
// El resto vive detrás del botón "Más"
const MORE_SECTIONS = ['personal', 'servicios', 'configuracion'] as const;

const primaryIcons: Record<(typeof PRIMARY_SECTIONS)[number], typeof CalendarDays> = {
	agenda: CalendarDays,
	clientes: Users,
	analiticas: BarChart3,
};

const moreIcons: Record<(typeof MORE_SECTIONS)[number], typeof UserRound> = {
	personal: UserRound,
	servicios: Scissors,
	configuracion: Settings,
};

const AUTO_ORDER: AgendaSection[] = [...PRIMARY_SECTIONS, ...MORE_SECTIONS];

function sectionLabel(id: AgendaSection) {
	return agendaSidebarItems.find((item) => item.id === id)?.label ?? id;
}

export function AgendaMockupMobile() {
	const [activeSection, setActiveSection] = useState<AgendaSection>('agenda');
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const isPausedRef = useRef(false);
	const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Avance automático: se detiene si hay interacción reciente O si la
	// hoja de "Más" está abierta (no queremos que cambie de sección con el
	// menú abierto encima).
	useEffect(() => {
		if (isPaused || isMoreOpen) return;

		const interval = setInterval(() => {
			setActiveSection((current) => {
				const currentIndex = AUTO_ORDER.indexOf(current);
				const nextIndex = (currentIndex + 1) % AUTO_ORDER.length;
				return AUTO_ORDER[nextIndex];
			});
		}, AUTO_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [activeSection, isPaused, isMoreOpen]);

	useEffect(() => {
		return () => {
			if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
		};
	}, []);

	function reportInteraction() {
		if (!isPausedRef.current) {
			isPausedRef.current = true;
			setIsPaused(true);
		}

		if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
		resumeTimeoutRef.current = setTimeout(() => {
			isPausedRef.current = false;
			setIsPaused(false);
		}, RESUME_AFTER_IDLE_MS);
	}

	function handleSelect(id: AgendaSection) {
		setActiveSection(id);
		setIsMoreOpen(false);
		reportInteraction();
	}

	const view =
		activeSection === 'agenda' ? (
			<AgendaView />
		) : activeSection === 'clientes' ? (
			<ClientsView />
		) : activeSection === 'servicios' ? (
			<ServicesView />
		) : activeSection === 'personal' ? (
			<StaffView />
		) : activeSection === 'analiticas' ? (
			<AnalyticsView />
		) : (
			<SettingsView />
		);

	const isMoreActive = (MORE_SECTIONS as readonly string[]).includes(activeSection);

	return (
		<section className="px-4 pb-14 sm:hidden">
			<div className="mx-auto max-w-sm">
				<div
					className="relative flex h-170 flex-col overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white p-2 shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
					onClickCapture={reportInteraction}
					onScrollCapture={reportInteraction}
					onTouchStartCapture={reportInteraction}
					onTouchMoveCapture={reportInteraction}
				>
					{/* Barra superior */}
					<div className="flex shrink-0 items-center gap-2 rounded-[1.75rem] px-2 py-2">
						<div className="flex size-8 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
							<Logo tone="dark" showWordmark={false} className="text-[11px]" />
						</div>
						<div>
							<p className="text-xs font-medium text-neutral-950">
								Studio Norte
							</p>
							<p className="text-[10px] text-neutral-400">Panel operativo</p>
						</div>
					</div>

					{/* Contenido de la sección activa */}
					<div className="mt-1 min-h-0 flex-1 px-1">{view}</div>

					{/* Barra de navegación inferior */}
					<div className="mt-2 grid shrink-0 grid-cols-4 gap-1 border-t border-neutral-200 px-1 pt-2">
						{PRIMARY_SECTIONS.map((id) => {
							const Icon = primaryIcons[id];
							const isActive = activeSection === id;
							return (
								<button
									key={id}
									type="button"
									onClick={() => handleSelect(id)}
									className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors ${
										isActive ? 'text-neutral-950' : 'text-neutral-400'
									}`}
								>
									<Icon className="size-4" />
									{sectionLabel(id)}
								</button>
							);
						})}
						<button
							type="button"
							onClick={() => {
								setIsMoreOpen(true);
								reportInteraction();
							}}
							className={`relative flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors ${
								isMoreActive || isMoreOpen
									? 'text-neutral-950'
									: 'text-neutral-400'
							}`}
						>
							<span className="absolute right-2 top-0 size-1.5 rounded-full bg-amber-500" />
							<Ellipsis className="size-4" />
							Más
						</button>
					</div>

					{/* Hoja inferior de "Más" */}
					{isMoreOpen && (
						<div className="absolute inset-0 z-10 flex flex-col justify-end">
							<button
								type="button"
								aria-label="Cerrar"
								className="absolute inset-0 bg-neutral-950/30"
								onClick={() => setIsMoreOpen(false)}
							/>
							<div className="relative rounded-t-[1.75rem] border border-neutral-200 bg-white p-4 shadow-[0_-20px_50px_rgba(0,0,0,0.12)]">
								<div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200" />
								<div className="flex items-center justify-between">
									<p className="text-sm font-semibold text-neutral-950">
										Más
									</p>
									<button
										type="button"
										onClick={() => setIsMoreOpen(false)}
										className="text-neutral-400"
									>
										<X className="size-4" />
									</button>
								</div>
								<div className="mt-3 space-y-1">
									{MORE_SECTIONS.map((id) => {
										const Icon = moreIcons[id];
										const isActive = activeSection === id;
										return (
											<button
												key={id}
												type="button"
												onClick={() => handleSelect(id)}
												className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors ${
													isActive
														? 'bg-neutral-100 text-neutral-950'
														: 'text-neutral-600 hover:bg-neutral-50'
												}`}
											>
												<Icon className="size-4" />
												{sectionLabel(id)}
											</button>
										);
									})}
								</div>
								<button
									type="button"
									className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600"
								>
									<LogOut className="size-4" />
									Cerrar sesión
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}