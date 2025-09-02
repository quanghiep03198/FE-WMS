import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import Footer from '../-components/footer'
import { Header } from './-components/header'
import RFIDAgentHero from './-components/hero-section'

export const Route = createFileRoute('/(public)/explore/rfid-agent')({
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
			<Header />
			<RFIDAgentHero />
			{/* <IntroductionSection /> */}
			<Footer />
		</Fragment>
	)
}
