import { UserRole } from '@common/constants/enums'
import { Div } from '@components/customs/div'
import Threads from '@components/motions/threads'
import AppLogo from '@components/shared/app-logo'
import GridBackground from '@components/shared/grid-background'
import Loading from '@components/shared/loading'
import ThemeToggle from '@components/shared/theme-toggle'
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import LoginForm from '@features/auth/components/login/login-form'
import type { MascotAction, MascotActionType, MascotFocusTarget } from '@features/auth/components/login/login-mascot'
import LoginMascot from '@features/auth/components/login/login-mascot'
import useAuth from '@hooks/use-auth'
import useTheme from '@hooks/use-theme'
import { createFileRoute, Link, Navigate, redirect } from '@tanstack/react-router'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, LanguageSelector } from '../../features/auth/components/login/page-composition'
import type { FileRouteTypes } from '../../route-tree.gen'

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
	const [mascotFocusTarget, setMascotFocusTarget] = useState<MascotFocusTarget>('none')
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [usernameProgress, setUsernameProgress] = useState(0)
	const [mascotAction, setMascotAction] = useState<MascotAction | null>(null)
	const nextMascotActionId = useRef(0)
	const { theme } = useTheme()

	const handleMascotAction = (type: MascotActionType) => {
		setMascotAction({ type, id: ++nextMascotActionId.current })
	}

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
			<meta content='Warehouse management system authentication' name='description' />

			<Container>
				{/* <ThemeSelector />
				<HomeNavigator /> */}
				<Card className=' z-10 mx-auto grid gap-0 w-full max-w-6xl auto-rows-max gap-y-0 overflow-clip rounded-lg border p-0 shadow-2xl md:max-w-xl lg:max-w-lg xl:grid-cols-[1.5fr_1fr]'>
					<Div
						className='relative row-span-3 hidden overflow-clip xl:block'
						onContextMenu={(e) => e.preventDefault()}>
						<Link
							className='absolute top-6 z-10 left-6 group mx-auto mb-6 sm:zoom-[0.8]'
							data-state='expanded'
							to='/'>
							<AppLogo />
						</Link>
						<Threads
							color={theme === 'dark' ? '#fafafa' : '#525252'}
							enableMouseInteraction={true}
							fade={0.5}
							taper={0.9}
						/>
					</Div>

					<CardHeader className='py-6 xl:col-start-2'>
						<LoginMascot
							action={mascotAction}
							focusTarget={mascotFocusTarget}
							passwordVisible={passwordVisible}
							usernameProgress={usernameProgress}
						/>
						<CardTitle className=' mt-6 text-center text-2xl whitespace-nowrap'>
							{t('ns_auth:texts.title')}
						</CardTitle>
						<CardAction>
							<ThemeToggle />
						</CardAction>
					</CardHeader>
					<CardContent className='xl:col-start-2 xl:basis-2/5 bg-card/50 backdrop-blur-sm'>
						<LoginForm
							onMascotAction={handleMascotAction}
							onMascotFocusChange={setMascotFocusTarget}
							onMascotPasswordVisibilityChange={setPasswordVisible}
							onUsernameProgressChange={setUsernameProgress}
						/>
					</CardContent>
					<CardFooter className='py-10 xl:col-start-2 xl:basis-2/5 flex flex-col gap-4'>
						<LanguageSelector />
					</CardFooter>
				</Card>
			</Container>
			<GridBackground className='mask-[radial-gradient(75%_100%_at_top_left,white,transparent)]' />
		</Fragment>
	)
}
