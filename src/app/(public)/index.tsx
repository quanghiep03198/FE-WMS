import { createFileRoute, useRouterState } from '@tanstack/react-router';
import Header from './_components/-header';
import { Div } from '@/components/ui';
import GridBackground from './_components/-grid-background';
import Footer from './_components/-footer';
import HeroSection from './_components/-hero-section';
import { useEffect } from 'react';
import FeaturesSection from './_components/-features-section';
import FAQsSection from './_components/-faq-section';
import SupportSection from './_components/-support-section';
import Spotlight from './_components/-spotlight';

export const Route = createFileRoute('/(public)/')({
	component: HomePage
});

export default function HomePage() {
	return (
		<Div className='relative min-h-screen scroll-m-2 scroll-smooth bg-background text-foreground antialiased scrollbar-none'>
			<Header />
			<Spotlight className='fixed -top-[20%] left-[10%] z-0' />
			<GridBackground />
			<Div className='mb-20 space-y-64'>
				<HeroSection />
				<FeaturesSection />
				<SupportSection />
				<FAQsSection />
			</Div>
			<Footer />
		</Div>
	);
}

export function useScrollIntoView({
	hashMatch,
	target,
	block = 'center'
}: {
	hashMatch: string;
	target: HTMLDivElement | null;
	block?: ScrollIntoViewOptions['block'];
}) {
	const { location } = useRouterState();

	useEffect(() => {
		if (target && location.hash === hashMatch) {
			target.scrollIntoView({
				block: block,
				behavior: 'smooth'
			});
		}
	}, [location.hash]);
}
