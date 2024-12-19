import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { SidebarProvider } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../_components/_errors/-error-boundary-fallback'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from './_contexts/-breadcrumb-context'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	pendingComponent: Loading,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated)
			throw redirect({
				to: '/login'
			})
	}
})

function Layout() {
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
											fallbackRender={({ error, resetErrorBoundary }) => (
												<ErrorBoundaryFallback error={error as Error} resetError={resetErrorBoundary} />
											)}>
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
