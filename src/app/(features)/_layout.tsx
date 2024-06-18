import useAuth from '@/common/hooks/use-auth'
import Loading from '@/components/shared/loading'
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

export const Route = createFileRoute('/(features)/_layout')({
	component: () => (
		<AuthGuard>
			<Layout />
		</AuthGuard>
	),
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated)
			throw redirect({
				to: '/login'
			})
	},
	wrapInSuspense: true,
	pendingComponent: () => <Loading className='h-screen' />
})

const Layout: React.FC = () => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
	const { t } = useTranslation()
	const { logout } = useAuth()

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		toast.promise(logout, {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_auth:notification.logout_success'),
			error: t('ns_auth:notification.logout_failed')
		})
	})

	return (
		<>
			<LayoutComposition.Container>
				<NavSidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
				<LayoutComposition.Main>
					<Navbar isCollapsed={isCollapsed} onCollapseStateChange={setIsCollapsed} />
					<LayoutComposition.OutletWrapper as='section'>
						<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</LayoutComposition.OutletWrapper>
				</LayoutComposition.Main>
			</LayoutComposition.Container>
		</>
	)
}
