import { Div } from '@/components/ui'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import FAQsSection from './_components/-faq-section'
import FeaturesSection from './_components/-features-section'
import Footer from './_components/-footer'
import GridBackground from './_components/-grid-background'
import Header from './_components/-header'
import HeroSection from './_components/-cta-section'
import SupportSection from './_components/-support-section'
import Loading from '@/components/shared/loading'
import Spotlight from './_components/-spotlight'

export const Route = createFileRoute('/(public)/')({
	component: HomePage,
	staleTime: Infinity,
	preloadStaleTime: Infinity
})

export default function HomePage() {
	return (
		<>
			<Helmet
				title='GL Warehouse Management System'
				meta={[{ name: 'description', content: 'Greenland Warehouse Management System' }]}
			/>
			{/* <Spotlight fill='hsl(var(--primary))' className='fixed left-1/3 z-20 xl:left-1/4' /> */}
			<Div className='relative min-h-screen scroll-m-2 scroll-smooth bg-background text-foreground antialiased scrollbar-none'>
				<Header />
				<GridBackground />
				<Div className='mb-20 space-y-64'>
					<HeroSection />
					<FeaturesSection />
					<SupportSection />
					<FAQsSection />
				</Div>
				<Footer />
			</Div>
		</>
	)
}

export function useScrollIntoView({
	hashMatch,
	target,
	block = 'center'
}: {
	hashMatch: string
	target: HTMLDivElement | null
	block?: ScrollIntoViewOptions['block']
}) {
	const { location } = useRouterState()

	useEffect(() => {
		if (target && location.hash === hashMatch) {
			target.scrollIntoView({
				block: block,
				inline: 'center',
				behavior: 'smooth'
			})
		}
	}, [location.hash, location.state])
}
