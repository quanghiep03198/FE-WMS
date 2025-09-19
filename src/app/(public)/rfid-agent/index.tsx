import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'

import Loading from '@/components/shared/loading'
import Footer from './-components/footer'
import { Header } from './-components/header'
import Hero from './-components/hero-section'
import Spotlight from './-components/spotlight'
import VisualBentoGrid from './-components/visual-bento-grid'

export const Route = createFileRoute('/(public)/rfid-agent/')({
	component: RouteComponent,
	pendingComponent: () => <Loading withContent={false} />
})

function RouteComponent() {
	return (
		<Fragment>
			<title>RFID Agent</title>
			<meta
				name='description'
				content='RFID Agent is a lightweight desktop application that connects your
					UHF reader to our web application'
			/>
			<main className='relative h-screen overflow-y-scroll scroll-smooth'>
				<Spotlight fill='white' className='-top-10 left-20 z-[-1] sm:-top-20 sm:left-20 md:left-20 xl:-top-40' />
				<Header />
				<Hero />
				<VisualBentoGrid />
				<Footer />
			</main>
		</Fragment>
	)
}
