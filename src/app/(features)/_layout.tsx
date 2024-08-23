import NetworkDetector from '@/components/shared/network-detector'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Fragment } from 'react'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from './_contexts/-breadcrumb-context'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
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
					<NavSidebar />
					<BreadcrumbProvider>
						<LayoutComposition.Main>
							<Navbar />
							<LayoutComposition.OutletWrapper>
								<QueryErrorResetBoundary>
									{({ reset }) => (
										<ErrorBoundary onReset={reset}>
											<Outlet />
										</ErrorBoundary>
									)}
								</QueryErrorResetBoundary>
							</LayoutComposition.OutletWrapper>
						</LayoutComposition.Main>
					</BreadcrumbProvider>
				</LayoutComposition.Container>
			</AuthGuard>
			<NetworkDetector />
		</Fragment>
	)
}
