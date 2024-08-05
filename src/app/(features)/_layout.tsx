import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavDrawerSidebar from './_components/_partials/-nav-drawer-sidebar'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'

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
		<AuthGuard>
			<LayoutComposition.Container>
				<NavSidebar />
				<NavDrawerSidebar />
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
			</LayoutComposition.Container>
		</AuthGuard>
	)
}
