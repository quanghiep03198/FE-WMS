import { Fragment } from 'react'
import { Div, TDivProps } from '@/components/ui'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import { Helmet } from 'react-helmet'
import HeroSection from './_components/-cta-section'
import FAQsSection from './_components/-faq-section'
import FeaturesSection from './_components/-features-section'
import Footer from './_components/-footer'
import GridBackground from './_components/-grid-background'
import Header from './_components/-header'
import SupportSection from './_components/-support-section'
import tw from 'tailwind-styled-components'

export const Route = createFileRoute('/(public)/')({
	component: Page
})

export default function Page() {
	return (
		<Fragment>
			<Helmet
				title='GL Warehouse Management System'
				meta={[{ name: 'description', content: 'Greenland Warehouse Management System' }]}
			/>
			<Container>
				<Header />
				<GridBackground />
				<Main>
					<HeroSection />
					<FeaturesSection />
					<SupportSection />
					<FAQsSection />
				</Main>
				<Footer />
			</Container>
		</Fragment>
	)
}

const Container = tw(
	Div
)<TDivProps>`relative h-screen overflow-y-auto scroll-m-2 scroll-smooth bg-background text-foreground antialiased scrollbar`
const Main = tw(Div)<TDivProps>`mb-20 space-y-64`

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

	useDeepCompareEffect(() => {
		if (target && location.hash === hashMatch) {
			target.scrollIntoView({
				block: block,
				inline: 'center',
				behavior: 'smooth'
			})
		}
	}, [location.hash, location.state])
}
