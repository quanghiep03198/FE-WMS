import { AuthService } from '@/services/auth.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'

export const USER_PROVIDE_TAG = 'USER'

export const getUserProfileQuery = (config?: AxiosRequestConfig) => {
	return queryOptions({
		queryKey: [USER_PROVIDE_TAG],
		queryFn: () => AuthService.profile(config),
		staleTime: 1000 * 60,
		enabled: AuthService.getHasAccessToken(),
		select: (data) => data.metadata
	})
}

export function useGetUserProfile() {
	return useQuery(getUserProfileQuery())
}
