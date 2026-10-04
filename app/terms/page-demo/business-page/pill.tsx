import { cn } from '@/lib/utils';

type PillProps = {
	children: React.ReactNode;
	onClick?: () => void;
	/** Apagado: no se puede elegir. Se ve apagado y no hace nada. */
	disabled?: boolean;
	/** Elegido: la demostración necesita distinguirlo del foco. */
	pressed?: boolean;
	className?: string;
	/** Para los lectores de pantalla, cuando lo que se ve es sólo un número. */
	label?: string;
	variant?: 'outline' | 'solid';
};

/**
 * Los botones de la página del negocio. No es el `Button` de la landing: aquél es
 * chico y con esquinas de 0.5rem, éste es una píldora alta del tamaño de un dedo,
 * porque se aprieta desde un teléfono con el pulgar de la mano menos hábil.
 */
export function Pill({
	children,
	onClick,
	disabled,
	pressed,
	className,
	label,
	variant = 'outline',
}: PillProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-pressed={pressed}
			aria-label={label}
			className={cn(
				'inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors',
				'h-11 disabled:pointer-events-none disabled:opacity-40',
				variant === 'solid'
					? 'bg-ink-950 text-white hover:bg-ink-800'
					: 'bg-white text-ink-950 ring-1 ring-inset ring-paper-300 hover:bg-paper-200',
				pressed &&
					variant === 'outline' &&
					'bg-ink-950 text-white ring-ink-950 hover:bg-ink-950',
				className,
			)}
		>
			{children}
		</button>
	);
}
