import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'

import Footer from './-components/footer'
import { Header } from './-components/header'
import Hero from './-components/hero-section'
import Spotlight from './-components/spotlight'
import VisualBentoGrid from './-components/visual-bento-grid'

export const Route = createLazyFileRoute('/(public)/rfid-agent/')({
	component: RouteComponent
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
				<Spotlight fill='white' className='-left-16 -top-10 z-[-1] md:-top-20 md:left-20 xl:-top-60' />
				<Header />
				<Hero />
				<VisualBentoGrid />
				<Footer />
			</main>
		</Fragment>
	)
}
