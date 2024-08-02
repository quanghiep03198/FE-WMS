import { Div } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUserProfileQuery } from '../(auth)/_apis/auth.api'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import Unauthorized from '../_components/_errors/-unauthorized'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavDrawerSidebar from './_components/_partials/-nav-drawer-sidebar'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	errorComponent: Unauthorized,
	loader: async ({ context: { queryClient }, abortController }) => {
		return await queryClient.ensureQueryData(getUserProfileQuery({ signal: abortController.signal }))
	},
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated)
			throw redirect({
				to: '/login'
			})
	},
	pendingComponent: Pending
})

function Layout() {
	return (
		<AuthGuard>
			<LayoutComposition.Container role='region'>
				<NavSidebar />
				<NavDrawerSidebar />
				<LayoutComposition.Main as='main' role='main'>
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
	return <Div className='w-screen flex items-center justify-center h-screen'>Authenticating ...</Div>
}
