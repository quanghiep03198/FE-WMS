import { useGetUserProfileQuery } from '@/app/(auth)/_apis/auth.api'
import { useAuth } from '@/common/hooks/use-auth'
import Loading from '@/components/shared/loading'
import { Div, Icon, Typography } from '@/components/ui'
import { useRouter } from '@tanstack/react-router'
import { isEqual } from 'lodash'
import React, { Fragment, useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { user, accessToken, isAuthenticated, setUserProfile, logout } = useAuth()
	const { data, isLoading, isError } = useGetUserProfileQuery()
	const router = useRouter()

	useEffect(() => {
		if (!isEqual(user, data)) setUserProfile(data)
		if (isError) logout()
		if (!isAuthenticated) router.invalidate().finally(() => router.navigate({ to: '/login' }))
	}, [data, accessToken, isAuthenticated, isError])

	if (isLoading)
		return (
			<Fragment>
				<Loading />
				<Div className='h-screen w-full flex justify-center items-center gap-x-2'>
					<Icon name='LoaderCircle' size={18} className='animate-[spin_2s_linear_infinite]' />
					<Typography variant='small' className='tracking-wider'>
						Loading ...
					</Typography>
				</Div>
			</Fragment>
		)

	return children
}

export default AuthGuard
