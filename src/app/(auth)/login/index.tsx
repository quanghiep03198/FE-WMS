import GridBackground from '@/app/(public)/_components/-grid-background'
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
			</Helmet>
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
