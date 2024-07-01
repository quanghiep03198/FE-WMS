import { AuthService } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'

export const USER_PROVIDE_TAG = 'USER'

export function useGetUserProfile() {
	const accessToken = AuthService.getAccessToken()

	return useQuery({
		queryKey: [USER_PROVIDE_TAG],
		queryFn: AuthService.profile,
		staleTime: 1000 * 60,
		select: (data) => data.metadata,
		enabled: Boolean(accessToken)
	})
}
