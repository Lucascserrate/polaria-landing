'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { cn } from './cn';

export function Reveal({
	children,
	className,
	delay = 0,
	as: Tag = 'div',
}: {
	children: ReactNode;
	className?: string;
	/** Milisegundos de retraso, para escalonar hermanos. */
	delay?: number;
	as?: ElementType;
}) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (typeof IntersectionObserver === 'undefined') {
			element.dataset.reveal = 'shown';
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					element.dataset.reveal = 'shown';
					observer.disconnect();
				}
			},
			{ rootMargin: '0px 0px -12% 0px' },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<Tag
			ref={ref}
			data-reveal=""
			style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
			className={cn(className)}
		>
			{children}
		</Tag>
	);
}