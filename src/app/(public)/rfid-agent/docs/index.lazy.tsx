import { ErrorBoundaryFallback } from '@/app/-components/-errors/error-boundary-fallback'
import { Div, Icon, Separator, SidebarProvider, Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useRafState } from 'ahooks'
import { ErrorBoundary } from 'react-error-boundary'
import MosquittoConfiguration from './-components/mosquitto-configuration'
import MosquittoInstallation from './-components/mosquitto-installation'
import MosquittoIntroduction from './-components/mosquitto-introduction'
import MosquittoUsageReason from './-components/mosquitto-usage-reason'
import NavSidebar from './-components/nav-sidebar'
import RFIDAgentConfiguration from './-components/rfid-agent-configuration'
import RFIDAgentInstallation from './-components/rfid-agent-installation'
import RFIDAgentIntroduction from './-components/rfid-agent-introduction'
import RFIDAgentUsageReason from './-components/rfid-agent-usage-reason'

export const Route = createLazyFileRoute('/(public)/rfid-agent/docs/')({
	component: RouteComponent
})

function RouteComponent() {
	const [windowSize] = useRafState({
		width: 0,
		height: 0
	})

	return (
		<SidebarProvider className='h-screen !overflow-hidden [&:has(#toggle-fullscreen[data-state="checked"])_header]:z-0'>
			<NavSidebar />
			<Div
				className='relative h-full flex-1 overflow-y-scroll scroll-smooth @container'
				style={
					{
						'--header-height': 80 + 'px',
						'--outlet-padding-bottom': 24 + 'px',
						'--outlet-wrapper-height': windowSize.height - 104 + 'px'
					} as React.CSSProperties
				}>
				{/* <Navbar /> */}
				<Div
					as='main'
					id='outlet-wrapper'
					className='container max-w-6xl flex-1 basis-full p-6 pb-[var(--outlet-padding-bottom)] sm:px-4'>
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
							</Div>
						</Div>
					</ErrorBoundary>
				</Div>
			</Div>
		</SidebarProvider>
	)
}
