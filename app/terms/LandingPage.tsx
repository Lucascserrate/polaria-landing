import { AgendaMockup } from './mockups/AgendaMockup';
import { BusinessTypes } from './sections/BusinessTypes';
import { Features } from './sections/Features';
import { Hero } from './sections/Hero';
import { NavBar } from './sections/NavBar';
import { FaqSection } from './sections/FaqSection';
import { PricingContactSection } from './sections/PricingContactSection';
import { SimpleSteps } from './sections/SimpleSteps';
import { WhatsAppFlow } from './sections/WhatsAppFlow';
import { WhatsAppSection } from './sections/WhatsAppSection';
import { AgendaMockupMobile } from './mockups/AgendaMockupMobile';
import { PageDemo } from './page-demo';

export default function LandingPage() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-white text-neutral-950">
			<NavBar />
			<main>
				<Hero />
				<AgendaMockup />
				<AgendaMockupMobile />
				<BusinessTypes />
				<Features />
				<WhatsAppSection />
				<PageDemo />
				<WhatsAppFlow />
				<FaqSection />
				<SimpleSteps />
				<PricingContactSection />
			</main>
		</div>
	);
}
