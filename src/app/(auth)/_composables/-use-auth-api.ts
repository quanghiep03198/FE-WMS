import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'

export const USER_PROVIDE_TAG = 'USER'

export function getUserProfileQuery(config?: AxiosRequestConfig) {
	return queryOptions({
		queryKey: [USER_PROVIDE_TAG],
		queryFn: () => AuthService.profile(config),
		staleTime: +env('VITE_DEFAULT_TTL', 300_000), // Cache for 5 minutes
		enabled: AuthService.getHasAccessToken()
	})
}

export function useGetUserProfileQuery() {
	return useQuery(getUserProfileQuery())
}
