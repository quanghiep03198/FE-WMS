import { useAuth } from '@/common/hooks/use-auth'
import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { ErrorComponentProps, Outlet, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'

export const Route = createFileRoute('/(preferences)/_layout')({
	component: Layout,
	loader: AuthService.profile,
	errorComponent: AuthenticationError,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated)
			throw redirect({
				to: '/login'
			})
	},
	wrapInSuspense: true,
	staleTime: +env('VITE_DEFAULT_TTL', 300_000)
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

function AuthenticationError({ reset }: ErrorComponentProps) {
	const router = useRouter()
	router.invalidate().finally(() => {
		reset()
		AuthService.logout()
		router.navigate({ to: '/login' })
	})

	return null
}
