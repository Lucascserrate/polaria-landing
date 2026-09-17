import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Polaria',
	description: 'AI Booking Assistant',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className="h-full">
			<body className="antialiased h-full flex flex-col">
				{children}
			</body>
		</html>
	);
}
