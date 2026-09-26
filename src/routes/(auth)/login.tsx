import { UserRole } from '@common/constants/enums'
import AppLogo from '@components/shared/app-logo'
import GridBackground from '@components/shared/grid-background'
import Loading from '@components/shared/loading'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Div } from '@components/ui'
import LoginForm from '@features/auth/components/login/login-form'
import useAuth from '@hooks/use-auth'
import { createFileRoute, Link, Navigate, redirect } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Container,
	HomeNavigator,
	LanguageSelector,
	ThemeSelector
} from '../../features/auth/components/login/page-composition'
import { FileRouteTypes } from '../../route-tree.gen'

export const Route = createFileRoute('/(auth)/login')({
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
	const { t } = useTranslation()

	if (isAuthenticated) {
		const redirectRoute: FileRouteTypes['to'] =
			Array.isArray(user?.roles) &&
			user.roles.every((role) => role === UserRole.IE_STAFF || role === UserRole.SECURITY_GUARD)
				? '/truckload-delivery'
				: '/dashboard'

		return <Navigate to={redirectRoute} />
	}

	return (
		<Fragment>
			<title>Login</title>
			<meta name='description' content='Warehouse management system authentication' />

			<Container>
				<ThemeSelector />
				<HomeNavigator />
				<Card className='relative z-10 mx-auto grid w-full max-w-7xl auto-rows-max gap-y-0 overflow-clip rounded-lg border p-0 shadow-2xl md:max-w-xl lg:max-w-lg xl:grid-cols-[1.5fr_1fr]'>
					<Div className='row-span-3 hidden overflow-clip p-0 xl:block' onContextMenu={(e) => e.preventDefault()}>
						<video
							src='/wms-trailer.mp4'
							autoPlay
							loop
							muted
							className='h-full w-full border-none object-cover object-center outline-none!'
						/>
					</Div>
					<CardHeader className='py-6 xl:col-start-2'>
						<Link to='/' className='group mx-auto mb-6 sm:zoom-[0.8]' data-state='expanded'>
							<AppLogo />
						</Link>
						<CardTitle className='text-center text-2xl whitespace-nowrap'>{t('ns_auth:texts.title')}</CardTitle>
					</CardHeader>
					<CardContent className='xl:col-start-2 xl:basis-2/5'>
						<LoginForm />
					</CardContent>
					<CardFooter className='py-10 xl:col-start-2 xl:basis-2/5'>
						<LanguageSelector />
					</CardFooter>
				</Card>
			</Container>
			<GridBackground className='mask-[radial-gradient(75%_100%_at_top_left,white,transparent)]' />
		</Fragment>
	)
}
