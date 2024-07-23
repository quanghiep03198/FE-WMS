import { useAuth } from '@/common/hooks/use-auth'
import { Navigate } from '@tanstack/react-router'
import React from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) return <Navigate to='/login' />

	return children
}

export default AuthGuard
