import { AuthService } from '@/services/auth.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'

export const USER_PROVIDE_TAG = 'USER'

export function getUserProfileQuery(config?: AxiosRequestConfig) {
	return queryOptions({
		queryKey: [USER_PROVIDE_TAG],
		queryFn: () => AuthService.profile(config),
		refetchOnMount: 'always',
		networkMode: 'online',
		enabled: AuthService.getHasAccessToken(),
		select: (response) => response.metadata,
		retry: () => AuthService.getHasAccessToken()
	})
}

export function useGetUserProfileQuery() {
	return useQuery(getUserProfileQuery())
}
