import env from '@/common/utils/env'
import Loading from '@/components/shared/loading'
import { AuthService } from '@/services/auth.service'
import { Outlet, createFileRoute, redirect, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavDrawerSidebar from './_components/_partials/-nav-drawer-sidebar'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	pendingComponent: Loading,
	errorComponent: AuthenticationError,
	loader: AuthService.profile,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	},
	wrapInSuspense: true,
	staleTime: +env('VITE_DEFAULT_TTL', 300_000)
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

function AuthenticationError({ reset }: ErrorComponentProps) {
	const router = useRouter()

	router.invalidate().finally(() => {
		reset()
		AuthService.logout()
		router.navigate({ to: '/login' })
	})

	return null
}
