import type { ReactNode } from 'react';

import { pageDemo } from '@/content/page-demo';
import { StatusBar } from './status-bar';

export function PhoneFrame({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto w-full max-w-70 sm:max-w-84">
			<div className="flex aspect-320/580 flex-col overflow-hidden rounded-[2.25rem] border-[7px] border-ink-950 bg-ink-950 shadow-[0_24px_60px_-20px_rgb(10_10_10/0.25)]">
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-white">
					<StatusBar />
					<div
						data-phone-screen
						className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden"
					>
						{children}
					</div>
				</div>
			</div>

			<p className="mt-5 text-center text-xs font-medium text-ink-700">
				{pageDemo.address}
			</p>
			<p className="mx-auto mt-1.5 max-w-xs text-center text-xs leading-relaxed text-ink-500">
				{pageDemo.footnote}
			</p>
		</div>
	);
}
