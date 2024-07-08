import { useAuth } from '@/common/hooks/use-auth'
import Loading from '@/components/shared/loading'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'

export const Route = createFileRoute('/(preferences)/_layout')({
	component: Layout,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated)
			throw redirect({
				to: '/login'
			})
	},
	wrapInSuspense: true,
	pendingComponent: Loading
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
		<AuthGuard>
			<LayoutComposition.Container>
				<LayoutComposition.Heading />
				<LayoutComposition.MainSection as='section'>
					<LayoutComposition.Navbar />
					<LayoutComposition.OutletWrapper>
						<Outlet />
					</LayoutComposition.OutletWrapper>
				</LayoutComposition.MainSection>
			</LayoutComposition.Container>
		</AuthGuard>
	)
}
