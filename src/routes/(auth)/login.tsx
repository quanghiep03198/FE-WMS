import { UserRole } from '@common/constants/enums'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import GridBackground from '@components/shared/grid-background'
import Loading from '@components/shared/loading'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { Separator } from '@components/ui/separator'
import LoginForm from '@features/auth/components/login/login-form'
import type { MascotAction, MascotActionType, MascotFocusTarget } from '@features/auth/components/login/login-mascot'
import LoginMascot from '@features/auth/components/login/login-mascot'
import useAuth from '@hooks/use-auth'
import { createFileRoute, Link, Navigate, redirect } from '@tanstack/react-router'
import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Container,
	HomeNavigator,
	LanguageSelector,
	ThemeSelector
} from '../../features/auth/components/login/page-composition'
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
				<ThemeSelector />
				<HomeNavigator />
				<Card className='relative z-10 mx-auto grid w-full max-w-7xl xxl:max-w-8xl auto-rows-max gap-y-0 overflow-clip rounded-lg border p-0 shadow-2xl md:max-w-xl lg:max-w-lg xl:grid-cols-[2fr_1fr]'>
					<Div
						className='relative row-span-3 hidden overflow-clip xl:block p-4'
						onContextMenu={(e) => e.preventDefault()}>
						<Link
							className='absolute top-12 left-12 group mx-auto mb-6 sm:zoom-[0.8]'
							data-state='expanded'
							to='/'>
							<Div className='font-jetbrains flex items-center gap-x-3 group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
								<Div className='bg-[hsl(0_0%_9%)] font-jetbrains text-[hsl(0_0%_98%)] flex aspect-square flex-col items-center justify-center gap-y-2 rounded p-2 text-center text-sm leading-none font-medium group-data-[state=collapsed]:size-8 group-data-[state=collapsed]:gap-y-1.5 group-data-[state=collapsed]:p-0.75 group-data-[state=collapsed]:text-[10px] group-data-[state=collapsed]:tracking-widest group-data-[state=expanded]:size-12'>
									WMS
									<Separator className='h-0.5 w-full bg-[hsl(0_0%_98%)] group-data-[state=expanded]:h-0.75' />
								</Div>
								<Div className='transition-all duration-200 group-data-[state=collapsed]:scale-75 group-data-[state=expanded]:w-auto group-data-[state=expanded]:scale-100 group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0'>
									<Typography className='font-jetbrains animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(0_0%_3.9%),45%,hsl(0_0%_45.1%),50%,hsl(0_0%_3.9%))] bg-size-[200%_100%] bg-clip-text text-xs leading-normal font-semibold tracking-widest text-transparent'>
										WAREHOUSE
										<br />
										MANAGEMENT
										<br />
										SYSTEM
									</Typography>
								</Div>
							</Div>
						</Link>
						<img
							className='h-full rounded-lg w-full border-none object-cover object-center outline-none!'
							loading='eager'
							src='/warehouse.webp'
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
					</CardHeader>
					<CardContent className='xl:col-start-2 xl:basis-2/5'>
						<LoginForm
							onMascotAction={handleMascotAction}
							onMascotFocusChange={setMascotFocusTarget}
							onMascotPasswordVisibilityChange={setPasswordVisible}
							onUsernameProgressChange={setUsernameProgress}
						/>
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
