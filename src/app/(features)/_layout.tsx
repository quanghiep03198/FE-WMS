import { PresetBreakPoints } from '@/common/constants/enums'
import useEffectOnce from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { Div, SidebarProvider } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useLocalStorageState, useRafState } from 'ahooks'
import { Fragment, useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { USER_PROVIDE_TAG } from '../(auth)/_apis/auth.api'
import { ErrorBoundaryFallback } from '../_components/_errors/-error-boundary-fallback'
import UnsupportedScreen from '../_components/_errors/-unsupported-screen'
import AuthGuard from '../_components/_guard/-auth-guard'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from './_contexts/-breadcrumb-context'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	pendingComponent: Loading,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	},
	loader: async ({ context: { queryClient } }) => await queryClient.prefetchQuery({ queryKey: [USER_PROVIDE_TAG] })
})

function Layout() {
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
	const [font] = useLocalStorageState<string>('font', {
		defaultValue: '*:!font-sans',
		listenStorageChange: true
	})
	const [windowSize, setWindowSize] = useRafState({
		width: 0,
		height: 0
	})

	const headerRef = useRef<HTMLElement>(null)

	useEffectOnce(() => {
		if (document.body.classList.contains(font)) document.body.classList.remove(font)
		document.body.classList.add(font)
	})

	useEffect(() => {
		const onResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			})
		}
		onResize()

		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [])

	return (
		<Fragment>
			{isSmallScreen && <UnsupportedScreen />}
			<AuthGuard>
				<SidebarProvider className='relative !h-screen overflow-y-scroll [&:has(#toggle-fullscreen[data-state="checked"])_header]:z-0'>
					<NavSidebar />
					<Div
						className='flex-1 @container'
						style={
							{
								'--header-height': 80 + 'px',
								'--outlet-padding-bottom': 24 + 'px',
								'--outlet-wrapper-height': windowSize.height - 104 + 'px'
							} as React.CSSProperties
						}>
						<BreadcrumbProvider>
							<Navbar ref={headerRef} />
							<Div
								as='main'
								id='outlet-wrapper'
								className='flex-1 basis-full px-6 pb-[var(--outlet-padding-bottom)] [view-transition-name:main-content] sm:px-4'>
								<ErrorBoundary
									fallbackRender={({ error, resetErrorBoundary }) => {
										return <ErrorBoundaryFallback error={error as Error} resetError={resetErrorBoundary} />
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
