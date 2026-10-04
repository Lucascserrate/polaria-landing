export function StatusBar() {
	return (
		<div
			aria-hidden="true"
			className="grid h-7 shrink-0 grid-cols-3 items-center px-4 text-[0.625rem] font-medium tabular-nums text-ink-950"
		>
			<span>10:32</span>

			<span className="mx-auto size-1.5 rounded-full bg-ink-950" />

			<span className="flex items-center justify-end">
				<svg viewBox="0 0 18 12" fill="currentColor" className="h-2.5 w-4">
					<rect x="0" y="7" width="3" height="5" rx="1" />
					<rect x="4.5" y="5" width="3" height="7" rx="1" />
					<rect x="9" y="2.5" width="3" height="9.5" rx="1" />
					<rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.35" />
				</svg>
				<svg viewBox="0 0 26 12" fill="none" className="ml-1 h-2.5 w-5">
					<rect
						x="0.75"
						y="0.75"
						width="21"
						height="10.5"
						rx="3"
						stroke="currentColor"
						strokeWidth="1.5"
						opacity="0.4"
					/>
					<rect
						x="2.25"
						y="2.25"
						width="15"
						height="7.5"
						rx="1.5"
						fill="currentColor"
					/>
					<path
						d="M24 4v4c1-.3 1.5-1 1.5-2s-.5-1.7-1.5-2Z"
						fill="currentColor"
						opacity="0.4"
					/>
				</svg>
			</span>
		</div>
	);
}
