import useAuth from '@/common/hooks/use-auth'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import PageComposition from './_components/-page-composition'
import { useLocalStorageState } from 'ahooks'

export const Route = createFileRoute('/(auth)/login/')({
	component: LoginPage
})

function LoginPage() {
	const { isAuthenticated, userCompany } = useAuth()

	if (isAuthenticated && userCompany) return <Navigate to={'/dashboard'} />

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
