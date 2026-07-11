import { useGetUserProfileQuery } from '@/app/-hooks/use-user-asm'
import { Div, Icon, Typography } from '@/components/ui'
import useAuth from '@/hooks/use-auth'
import { AuthService } from '@/services/auth.service'
import { useRouter } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import GridBackground from '../shared/grid-background'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated, setUserProfile } = useAuth()
	const { data, isLoading, isError } = useGetUserProfileQuery()
	const router = useRouter()

	useEffect(() => {
		if (isError) AuthService.logout()
		setUserProfile(data)
	}, [data, isError])

	useEffect(() => {
		if (!isAuthenticated) router.invalidate().finally(() => router.navigate({ to: '/login' }))
	}, [isAuthenticated])

	if (isLoading)
		return (
			<Fragment>
				<title>Authenticating ...</title>

				<Div className='relative inset-0 z-50 flex h-screen w-full items-center justify-center gap-x-2 antialiased'>
					<Icon name='LoaderCircle' size={18} className='animate-[spin_1.5s_linear_infinite]' />
					<Typography variant='small' className='font-medium tracking-wide'>
						Authenticating
					</Typography>
					<GridBackground />
				</Div>
			</Fragment>
		)

	return children
}

export default AuthGuard
