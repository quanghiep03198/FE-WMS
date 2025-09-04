import { ErrorBoundaryFallback } from '@/app/-components/-errors/error-boundary-fallback'
import { Div, Icon, Separator, SidebarProvider, Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useRafState } from 'ahooks'
import { ErrorBoundary } from 'react-error-boundary'
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

export const Route = createLazyFileRoute('/(public)/rfid-agent/docs/')({
	component: RouteComponent
})

function RouteComponent() {
	const [windowSize] = useRafState({
		width: 0,
		height: 0
	})

	return (
		<SidebarProvider className='h-screen overflow-hidden'>
			<NavSidebar />
			<Div id='content' className='relative h-full flex-1 overflow-y-scroll @container'>
				<NavHeader />
				<Div
					as='main'
					className='container relative max-w-6xl flex-1 basis-full p-6 pb-[var(--outlet-padding-bottom)] sm:px-4'>
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
						<Div className='space-y-20'>
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
						</Div>
					</ErrorBoundary>
				</Div>
			</Div>
		</SidebarProvider>
	)
}
