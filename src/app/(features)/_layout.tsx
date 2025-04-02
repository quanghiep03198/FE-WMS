import { PresetBreakPoints } from '@/common/constants/enums'
import useEffectOnce from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { SidebarProvider } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { USER_PROVIDE_TAG } from '../(auth)/_apis/auth.api'
import { ErrorBoundaryFallback } from '../_components/_errors/-error-boundary-fallback'
import UnsupportedScreen from '../_components/_errors/-unsupported-screen'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
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

	useEffectOnce(() => {
		if (document.body.classList.contains(font)) document.body.classList.remove(font)
		document.body.classList.add(font)
	})

	if (isSmallScreen) return <UnsupportedScreen />

	return (
		<Fragment>
			<AuthGuard>
				<LayoutComposition.Container>
					<SidebarProvider>
						<NavSidebar />
						<BreadcrumbProvider>
							<LayoutComposition.Main>
								<Navbar />
								<LayoutComposition.ScrollArea>
									<LayoutComposition.OutletWrapper>
										<ErrorBoundary
											fallbackRender={({ error, resetErrorBoundary }) => {
												return (
													<ErrorBoundaryFallback error={error as Error} resetError={resetErrorBoundary} />
												)
											}}>
											<Outlet />
										</ErrorBoundary>
									</LayoutComposition.OutletWrapper>
								</LayoutComposition.ScrollArea>
							</LayoutComposition.Main>
						</BreadcrumbProvider>
					</SidebarProvider>
				</LayoutComposition.Container>
			</AuthGuard>
			<NetworkDetector />
		</Fragment>
	)
}
