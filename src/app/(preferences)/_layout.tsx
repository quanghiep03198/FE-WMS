import Loading from '@/components/shared/loading'
import { Div, Separator } from '@/components/ui'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import useAuth from '@/common/hooks/use-auth'
import { useKeyPress } from 'ahooks'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(preferences)/_layout')({
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

function Layout() {
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
		<LayoutComposition.Container>
			<LayoutComposition.Heading />
			<LayoutComposition.MainSection as='section'>
				<LayoutComposition.Sidebar />
				<LayoutComposition.OutletWrapper>
					<Outlet />
				</LayoutComposition.OutletWrapper>
			</LayoutComposition.MainSection>
		</LayoutComposition.Container>
	)
}
