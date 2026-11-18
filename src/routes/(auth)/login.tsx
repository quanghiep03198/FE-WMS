import { UserRole } from '@common/constants/enums'
import GridBackground from '@components/shared/grid-background'
import Loading from '@components/shared/loading'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import LoginForm from '@features/auth/components/login/login-form'
import type { MascotAction, MascotActionType, MascotFocusTarget } from '@features/auth/components/login/login-mascot'
import LoginMascot from '@features/auth/components/login/login-mascot'
import useAuth from '@hooks/use-auth'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
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
				<Card className='max-w-xl w-full z-10 border-none shadow-none'>
					<CardHeader>
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
					<CardContent>
						<LoginForm
							onMascotAction={handleMascotAction}
							onMascotFocusChange={setMascotFocusTarget}
							onMascotPasswordVisibilityChange={setPasswordVisible}
							onUsernameProgressChange={setUsernameProgress}
						/>
					</CardContent>
					<CardFooter>
						<LanguageSelector />
					</CardFooter>
				</Card>
			</Container>
			<GridBackground className='mask-[radial-gradient(75%_100%_at_top_left,white,transparent)]' />
		</Fragment>
	)
}
