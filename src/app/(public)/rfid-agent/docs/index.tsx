import { ErrorBoundaryFallback } from '@/app/-components/-errors/error-boundary-fallback'
import { Div, Icon, Separator, SidebarProvider, Typography } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import FAQCommonQuestions from './-components/faq-common-issues'
import MosquittoConfiguration from './-components/mosquitto-configuration'
import MosquittoInstallation from './-components/mosquitto-installation'
import MosquittoIntroduction from './-components/mosquitto-introduction'
import MosquittoTroubleshooting from './-components/mosquitto-troubleshooting'
import MosquittoUsageReason from './-components/mosquitto-usage-reason'
import NavHeader from './-components/nav-header'
import NavSidebar from './-components/nav-sidebar'
import RFIDAgentUsageReason from './-components/rfid-agent-benefits'
import RFIDAgentConfiguration from './-components/rfid-agent-configuration'
import RFIDAgentInstallation from './-components/rfid-agent-installation'
import RFIDAgentIntroduction from './-components/rfid-agent-introduction'
import RFIDAgentTroubleShooting from './-components/rfid-agent-troubleshooting'
import { PageProvider } from './-contexts/page-context'

export const Route = createFileRoute('/(public)/rfid-agent/docs/')({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<SidebarProvider className='h-screen overflow-hidden'>
			<PageProvider>
				<NavSidebar />
				<Div id='content' className='relative h-screen flex-1 overflow-y-scroll scroll-smooth @container'>
					<NavHeader />
					<Div as='main' className='container relative flex-1 basis-full space-y-20 p-6 sm:p-4'>
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
