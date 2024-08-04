import { useAuth } from '@/common/hooks/use-auth'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import PageComposition from './_components/-page-composition'

export const Route = createFileRoute('/(auth)/login/')({
	component: LoginPage,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (isAuthenticated)
			throw redirect({
				to: '/dashboard'
			})
	}
})

function LoginPage() {
	const { isAuthenticated } = useAuth()
	console.log(isAuthenticated)
	if (isAuthenticated) return <Navigate to='/dashboard' />

	return (
		<Fragment>
			<Helmet title='Login' meta={[{ name: 'description', content: 'Greenland Warehouse Management System' }]} />
			<PageComposition.Container>
				<PageComposition.HomeNavigator />
				<PageComposition.ThemeSelector />
				<PageComposition.SideImage />
				<PageComposition.Section>
					<PageComposition.FormHeading />
					<PageComposition.FormSection />
					<PageComposition.LanguageSelector />
				</PageComposition.Section>
			</PageComposition.Container>
		</Fragment>
	)
}
