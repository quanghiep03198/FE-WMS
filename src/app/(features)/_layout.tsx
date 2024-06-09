import { Div } from '@/components/ui'
import { Outlet, createFileRoute, redirect, useNavigate, useRouteContext, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import NavDrawerSidebar from './_components/_partials/-nav-drawer-sidebar'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'
import AuthGuard from '../_components/_guard/-auth-guard'
import Loading from '@/components/shared/loading'
import useAuth from '@/common/hooks/use-auth'
import { useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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
		<Div className='flex max-h-screen items-stretch divide-x divide-border overflow-y-auto transition-width duration-200 ease-in-out scrollbar-thin'>
			<NavSidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
			<NavDrawerSidebar open={isCollapsed} onOpenStateChange={setIsCollapsed} />
			<Div className='relative flex h-screen max-w-full flex-1 flex-col overflow-y-auto bg-background transition-width duration-200 ease-in-out scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary'>
				<Navbar isCollapsed={isCollapsed} onCollapseStateChange={setIsCollapsed} />
				<Div as='section' className='h-full flex-1 p-6 sm:p-2'>
					<ErrorBoundary>
						<Outlet />
					</ErrorBoundary>
				</Div>
			</Div>
		</Div>
	)
}
