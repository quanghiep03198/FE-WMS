import { Div, Icon } from '@/components/ui'
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
						<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</LayoutComposition.OutletWrapper>
				</LayoutComposition.Main>
			</LayoutComposition.Container>
		</AuthGuard>
	)
}

function Pending() {
	return (
		<Div className='w-screen flex items-center justify-center h-screen gap-x-2'>
			<Icon name='LoaderCircle' className='animate-spin' /> Authenticating ...
		</Div>
	)
}
