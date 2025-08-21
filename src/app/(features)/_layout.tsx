import useEffectOnce from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { Div, SidebarProvider } from '@/components/ui'
import { Outlet, createFileRoute, redirect, useRouteContext } from '@tanstack/react-router'
import { useLocalStorageState, useRafState } from 'ahooks'
import { Fragment, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { type RegisteredServiceWorker } from 'virtual:pwa-register/react'
import { ErrorBoundaryFallback } from '../-components/-errors/error-boundary-fallback'
import UnsupportedScreen from '../-components/-errors/unsupported-screen'
import AuthGuard from '../-components/-guard/auth-guard'
import { AuthQueryKeys } from '../-hooks/use-user-asm'
import NavSidebar from './-components/-partials/nav-sidebar'
import Navbar from './-components/-partials/navbar'
import { BreadcrumbProvider } from './-contexts/breadcrumb-context'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	pendingComponent: Loading,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	},
	loader: async ({ context: { queryClient } }) => {
		return await queryClient.prefetchQuery({ queryKey: [AuthQueryKeys.PROFILE] })
	}
})

function Layout() {
	const isUnsupportedScreen = useMediaQuery('(min-width: 360px) and (max-width: 767px)')
	const { updateServiceWorker }: RegisteredServiceWorker = useRouteContext({
		from: '',
		select: (context) => context.serviceWorker
	})

	const [font] = useLocalStorageState<string>('font', {
		defaultValue: '*:!font-sans',
		listenStorageChange: true
	})
	const [windowSize, setWindowSize] = useRafState({
		width: 0,
		height: 0
	})

	useEffectOnce(() => {
		if (document.body.classList.contains(font)) document.body.classList.remove(font)
		document.body.classList.add(font)
	})

	useEffect(() => {
		const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
		onResize()
		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [])

	return (
		<Fragment>
			{isUnsupportedScreen && <UnsupportedScreen />}
			<AuthGuard>
				<SidebarProvider className='h-screen !overflow-hidden [&:has(#toggle-fullscreen[data-state="checked"])_header]:z-0'>
					<NavSidebar />
					<Div
						className='relative h-full flex-1 overflow-y-scroll @container'
						style={
							{
								'--header-height': 80 + 'px',
								'--outlet-padding-bottom': 24 + 'px',
								'--outlet-wrapper-height': windowSize.height - 104 + 'px'
							} as React.CSSProperties
						}>
						<BreadcrumbProvider>
							<Navbar />
							<Div
								as='main'
								id='outlet-wrapper'
								className='flex-1 basis-full px-6 pb-[var(--outlet-padding-bottom)] sm:px-4'>
								<ErrorBoundary
									fallbackRender={({ error, resetErrorBoundary }) => {
										return (
											<ErrorBoundaryFallback
												error={error as Error}
												resetError={(args) => {
													resetErrorBoundary(args)
													updateServiceWorker()
												}}
											/>
										)
									}}>
									<Outlet />
								</ErrorBoundary>
							</Div>
						</BreadcrumbProvider>
					</Div>
				</SidebarProvider>
			</AuthGuard>
			<NetworkDetector />
		</Fragment>
	)
}
