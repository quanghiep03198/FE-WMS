import useAuth from '@/common/hooks/use-auth'
import { useNavigate, useRouter } from '@tanstack/react-router'
import React, { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated } = useAuth()
	const router = useRouter()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isAuthenticated) router.invalidate().finally(() => navigate({ to: '/login' }))
	}, [isAuthenticated])

	return children
}

export default AuthGuard
