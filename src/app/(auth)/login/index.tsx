import GridBackground from '@/components/shared/grid-background'
import Loading from '@/components/shared/loading'
import useAuth from '@/hooks/use-auth'
import type { FileRouteTypes } from '@/route-tree.gen'
import { UserRole } from '@common/constants/enums'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import { Fragment } from 'react'
import PageComposition from './-components/page-composition'

export const Route = createFileRoute('/(auth)/login/')({
	component: LoginPage,
	pendingComponent: Loading,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (isAuthenticated)
			throw redirect({
				to: '/dashboard'
			})
	}
})

function LoginPage() {
	const { isAuthenticated, user } = useAuth()

	if (isAuthenticated) {
		const redirectRoute: FileRouteTypes['to'] = user.roles.every(
			(role) => role === UserRole.IE_STAFF || role === UserRole.SECURITY_GUARD
		)
			? '/truckload-delivery'
			: '/dashboard'

		return <Navigate to={redirectRoute} />
	}

	return (
		<Fragment>
			<title>Login</title>
			<meta name='description' content='Warehouse management system authentication' />

			<PageComposition.Container>
				<PageComposition.HomeNavigator />
				<PageComposition.ThemeSelector />
				<PageComposition.FormSection>
					<PageComposition.FormHeading />
					<PageComposition.FormFieldset />
					<PageComposition.LanguageSelector />
				</PageComposition.FormSection>
			</PageComposition.Container>
			<GridBackground className='[mask-image:radial-gradient(75%_100%_at_top_left,white,transparent)]' />
		</Fragment>
	)
}
