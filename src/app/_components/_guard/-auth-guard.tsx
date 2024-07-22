import { useGetUserProfileQuery } from '@/app/(auth)/_composables/-use-auth-api'
import { useAuth } from '@/common/hooks/use-auth'
import { generateAvatar } from '@/common/utils/generate-avatar'
import { AuthService } from '@/services/auth.service'
import { Navigate } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import React from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated, setUserProfile } = useAuth()

	// Get user profile after login successfully
	const { data, isSuccess, isError } = useGetUserProfileQuery()

	// Check authenticated status every time get profile query is triggered
	useDeepCompareEffect(() => {
		if (data && isSuccess) setUserProfile({ ...data, picture: generateAvatar({ name: data.display_name }) })
		if (isError) AuthService.logout()
	}, [data, , isSuccess, isError])

	if (!isAuthenticated) return <Navigate to='/login' />

	return children
}

export default AuthGuard
