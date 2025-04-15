import { PresetBreakPoints } from '@/common/constants/enums'
import useEffectOnce from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { Div, SidebarProvider } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useLocalStorageState, useSize } from 'ahooks'
import { Fragment, useMemo, useRef } from 'react'
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

	const containerRef = useRef<HTMLDivElement>(null)
	const outletWrapperRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	const containerSize = useSize(containerRef)
	const headerSize = useSize(headerRef)

	const outletWrapperPaddingY = useMemo(() => {
		if (outletWrapperRef.current) {
			const computedStyle = window.getComputedStyle(outletWrapperRef.current)
			const paddingTop = parseInt(computedStyle.paddingTop) || 0
			const paddingBottom = parseInt(computedStyle.paddingBottom) || 0
			return paddingTop + paddingBottom
		}
		return 0
	}, [outletWrapperRef.current])

	useEffectOnce(() => {
		if (document.body.classList.contains(font)) document.body.classList.remove(font)
		document.body.classList.add(font)
	})

	return (
		<Fragment>
			{isSmallScreen && <UnsupportedScreen />}
			<AuthGuard>
				<SidebarProvider className='group/app-layout'>
					<NavSidebar />
					<Div
						className='flex-1 @container'
						ref={containerRef}
						style={
							{
								'--header-height': headerSize ? headerSize.height + 'px' : '80px',
								'--outlet-wrapper-height':
									containerSize && headerSize
										? containerSize.height - headerSize.height - outletWrapperPaddingY + 'px'
										: 'calc(100vh-112px)'
							} as React.CSSProperties
						}>
						<BreadcrumbProvider>
							<Navbar ref={headerRef} />
							<Div
								as='main'
								className='flex-1 basis-full px-6 pb-6 [view-transition-name:main-content] sm:px-4'
								ref={outletWrapperRef}>
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
