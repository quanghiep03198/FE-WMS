import env from '@common/utils/env'
import { ErrorBoundaryFallback } from '@components/errors/error-boundary-fallback'
import { Div, Icon, Separator, SidebarProvider, Typography } from '@components/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import FAQCommonQuestions from '../../features/rfid-agent/components/docs/faq-common-issues'
import MosquittoConfiguration from '../../features/rfid-agent/components/docs/mosquitto-configuration'
import MosquittoInstallation from '../../features/rfid-agent/components/docs/mosquitto-installation'
import MosquittoIntroduction from '../../features/rfid-agent/components/docs/mosquitto-introduction'
import MosquittoTroubleshooting from '../../features/rfid-agent/components/docs/mosquitto-troubleshooting'
import MosquittoUsageReason from '../../features/rfid-agent/components/docs/mosquitto-usage-reason'
import NavHeader from '../../features/rfid-agent/components/docs/nav-header'
import NavSidebar from '../../features/rfid-agent/components/docs/nav-sidebar'
import RFIDAgentAutoStartup from '../../features/rfid-agent/components/docs/rfid-agent-auto-startup'
import RFIDAgentUsageReason from '../../features/rfid-agent/components/docs/rfid-agent-benefits'
import RFIDAgentConfiguration from '../../features/rfid-agent/components/docs/rfid-agent-configuration'
import RFIDAgentInstallation from '../../features/rfid-agent/components/docs/rfid-agent-installation'
import RFIDAgentIntroduction from '../../features/rfid-agent/components/docs/rfid-agent-introduction'
import RFIDAgentTroubleShooting from '../../features/rfid-agent/components/docs/rfid-agent-troubleshooting'
import { PageProvider } from '../../features/rfid-agent/contexts/rfid-agent-docs'

export const Route = createFileRoute('/(public)/rfid-agent-documentation')({
	component: RouteComponent
})

function RouteComponent() {
	const url = env<string>('VITE_APP_DOMAIN')

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
					name: 'RFID Agent documentation, your guide to using the RFID Agent application.',
					url: url,
					logo: new URL('logo.svg', url)
				})}
			</script>
			<SidebarProvider data-state-persistent-key='rfidAgentDocSidebarOpen' className='h-screen overflow-hidden'>
				<PageProvider>
					<NavSidebar />
					<Div className='@container relative flex h-screen flex-1 flex-col'>
						<NavHeader />
						<Div
							as='main'
							className='scroll-fade-y container max-h-full flex-1 basis-full space-y-20 overflow-y-scroll scroll-smooth p-6 sm:p-4'>
							<ErrorBoundary
								fallbackRender={({ error, resetErrorBoundary }) => {
									return (
										<ErrorBoundaryFallback
											error={error as Error}
											resetError={(args) => {
												resetErrorBoundary(args)
											}}
										/>
									)
								}}>
								<Div as='article' className='space-y-20'>
									<Typography variant='h1' className='inline-flex items-center gap-x-3'>
										<Icon name='Link' size={26} /> Eclipse Mosquitto
									</Typography>
									<MosquittoIntroduction />
									<MosquittoUsageReason />
									<MosquittoInstallation />
									<MosquittoConfiguration />
									<MosquittoTroubleshooting />
								</Div>
								<Separator />
								<Div as='article' className='space-y-20'>
									<Typography variant='h1' className='inline-flex items-center gap-x-3'>
										<Icon name='Link' size={26} /> RFID Agent
									</Typography>
									<RFIDAgentIntroduction />
									<RFIDAgentUsageReason />
									<RFIDAgentInstallation />
									<RFIDAgentConfiguration />
									<RFIDAgentAutoStartup />
									<RFIDAgentTroubleShooting />
								</Div>
								<Separator />
								<Div as='article' className='space-y-20'>
									<Typography variant='h1' className='inline-flex items-center gap-x-3'>
										<Icon name='Link' size={26} /> FAQ
									</Typography>
									<FAQCommonQuestions />
								</Div>
							</ErrorBoundary>
						</Div>
					</Div>
				</PageProvider>
			</SidebarProvider>
		</Fragment>
	)
}
