import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'

import Loading from '@/components/shared/loading'
import env from '@common/utils/env'
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
	const url = env('VITE_APP_DOMAIN')

	return (
		<Fragment>
			<title>RFID Agent</title>
			<meta
				name='description'
				content='RFID Agent is a lightweight desktop application that connects your
					UHF reader to our web application'
			/>
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Greenland Warehouse Management System',
					url: url,
					logo: new URL('logo.svg', url)
				})}
			</script>
			<main className='relative h-screen overflow-y-scroll scroll-smooth'>
				<Spotlight
					fill='white'
					className={'-top-10 left-20 sm:-left-20 sm:-top-10 sm:w-[250%] md:-left-10 md:w-[180%] xl:-top-40'}
				/>
				<Header />
				<Hero />
				<VisualBentoGrid />
				<Footer />
			</main>
		</Fragment>
	)
}
