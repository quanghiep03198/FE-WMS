import { createFileRoute, useRouterState } from '@tanstack/react-router';
import Header from './_components/-header';
import { Box } from '@/components/ui';
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
		<Box className='scrollbar-none relative min-h-screen scroll-m-2 scroll-smooth bg-background text-foreground antialiased'>
			<Header />
			<Spotlight className='fixed -top-[20%] left-[10%] z-0' />
			<GridBackground />
			<Box className='mb-20 space-y-64'>
				<HeroSection />
				<FeaturesSection />
				<SupportSection />
				<FAQsSection />
			</Box>
			<Footer />
		</Box>
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
