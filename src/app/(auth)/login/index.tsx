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

	if (isAuthenticated) return <Navigate to='/dashboard' />

	return (
		<Fragment>
			<Helmet>
				<title>Login</title>
				<meta name='description' content='Warehouse management system authentication' />
				<link rel='preload' href='/global-transport.svg' as='image' />
			</Helmet>
			<PageComposition.Container>
				<PageComposition.HomeNavigator />
				<PageComposition.ThemeSelector />
				<PageComposition.SideImage />
				<PageComposition.FormSection>
					<PageComposition.FormHeading />
					<PageComposition.FormFieldset />
					<PageComposition.LanguageSelector />
				</PageComposition.FormSection>
			</PageComposition.Container>
		</Fragment>
	)
}
