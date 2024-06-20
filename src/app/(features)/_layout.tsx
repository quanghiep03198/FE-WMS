import useAuth from '@/common/hooks/use-auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import { BreadcrumbProvider } from '@/components/providers/breadcrumbs-provider'

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
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
	const { logout } = useAuth()

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<AuthGuard>
			<LayoutComposition.Container>
				<NavSidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
				<LayoutComposition.Main as='main'>
					<BreadcrumbProvider>
						<Navbar isCollapsed={isCollapsed} onCollapseStateChange={setIsCollapsed} />
						<LayoutComposition.OutletWrapper as='section'>
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
