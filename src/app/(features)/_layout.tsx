import useAuth from '@/common/hooks/use-auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { useEffect, useState } from 'react'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from './_components/_providers/-breadcrumb-provider'
import useMediaQuery from '@/common/hooks/use-media-query'
import { BreakPoints } from '@/common/constants/enums'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	}
})

function Layout() {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)
	const { logout } = useAuth()

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	useEffect(() => {
		if (isLargeScreen) setIsCollapsed(isLargeScreen)
	}, [isLargeScreen])

	return (
		<AuthGuard>
			<LayoutComposition.Container>
				<NavSidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
				<LayoutComposition.Main as='main'>
					<BreadcrumbProvider>
						<Navbar isCollapsed={isCollapsed} onCollapseStateChange={setIsCollapsed} />
						<LayoutComposition.OutletWrapper>
							<ErrorBoundary>
								<Outlet />
							</ErrorBoundary>
						</LayoutComposition.OutletWrapper>
					</BreadcrumbProvider>
				</LayoutComposition.Main>
			</LayoutComposition.Container>
		</AuthGuard>
	)
}
