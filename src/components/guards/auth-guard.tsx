import Loading from '@components/shared/loading'
import { useGetUserProfileQuery } from '@features/auth/hooks/use-profile-request'
import { AuthService } from '@features/auth/services/auth.service'
import useAuth from '@hooks/use-auth'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { isAuthenticated, setUserProfile } = useAuth()
	const { data, isLoading, isError } = useGetUserProfileQuery()
	const router = useRouter()

	useEffect(() => {
		if (isError || !isAuthenticated) {
			AuthService.logout()
			router.navigate({ to: '/login' })
			return
		}
		if (data) setUserProfile(data)
	}, [data, isError, isAuthenticated])

	if (isLoading) return <Loading withContent={false} />

	return children
}

export default AuthGuard
