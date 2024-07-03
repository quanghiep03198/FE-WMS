import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from './_components/_providers/-breadcrumb-provider'
import { Icon, Typography } from '@/components/ui'
import { useAuth } from '@/common/hooks/use-auth'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		// if (!isAuthenticated) throw redirect({ to: '/login' })
	}
})

function Layout() {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
	const { user } = useAuth()

	return (
		<AuthGuard>
			<LayoutComposition.Container role='region'>
				<NavSidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
				<LayoutComposition.Main as='main' role='main'>
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
