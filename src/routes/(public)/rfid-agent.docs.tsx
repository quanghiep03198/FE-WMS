import { ErrorBoundaryFallback } from '@components/errors/error-boundary-fallback'
import { Div, Icon, Separator, SidebarProvider, Typography } from '@components/ui'
import { createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/(public)/rfid-agent/docs')({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<SidebarProvider data-state-persistent-key='rfidAgentDocSidebarOpen' className='h-screen overflow-hidden'>
			<PageProvider>
				<NavSidebar />
				<Div id='content' className='@container relative h-screen flex-1 overflow-y-scroll scroll-smooth'>
					<NavHeader />
					<Div as='main' className='relative container flex-1 basis-full space-y-20 p-6 sm:p-4'>
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
	)
}
