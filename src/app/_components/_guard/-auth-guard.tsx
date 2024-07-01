import { useGetUserProfile } from '@/app/_composables/-user.composable'
import { useAuth, useAuthStore } from '@/common/hooks/use-auth'
import { generateAvatar } from '@/common/utils/generate-avatar'
import { Navigate } from '@tanstack/react-router'
import React, { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated, logout } = useAuth()
	const { setUserProfile } = useAuthStore()

	// Get user profile after login successfully
	const { data, isSuccess, isError } = useGetUserProfile()

	// Check authenticated status every time get profile query is triggered
	useEffect(() => {
		if (data && isSuccess) {
			setUserProfile({ ...data, picture: generateAvatar({ name: data.display_name }) })
		}
		if (isError) logout()
	}, [data, isSuccess, isError])

	if (!isAuthenticated) return <Navigate to='/login' />

	return children
}

export default AuthGuard
