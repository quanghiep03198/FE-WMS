import { useGetUserProfileQuery } from '@/app/(auth)/_apis/auth.api'
import { useAuth } from '@/common/hooks/use-auth'
import { Div, Icon, Typography } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { useRouter } from '@tanstack/react-router'
import React, { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { token: accessToken, isAuthenticated, setUserProfile } = useAuth()
	const { data, isLoading, isError } = useGetUserProfileQuery()
	const router = useRouter()

	useEffect(() => {
		if (isError) AuthService.logout()
		if (!isAuthenticated) router.invalidate().finally(() => router.navigate({ to: '/login' }))
		setUserProfile(data)
	}, [data, accessToken, isAuthenticated, isError])

	if (isLoading)
		return (
			<Div className='h-screen w-full flex justify-center items-center gap-x-2 antialiased'>
				<Icon name='LoaderCircle' size={18} className='animate-[spin_1.5s_linear_infinite]' />
				<Typography variant='small' className='tracking-wide font-medium'>
					Loading ...
				</Typography>
			</Div>
		)

	return children
}

export default AuthGuard
