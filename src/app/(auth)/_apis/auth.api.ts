import { AuthService } from '@/services/auth.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosRequestConfig, HttpStatusCode } from 'axios'

export const USER_PROVIDE_TAG = 'USER'

export function getUserProfileQuery(config?: AxiosRequestConfig) {
	return queryOptions({
		queryKey: [USER_PROVIDE_TAG],
		queryFn: () => AuthService.profile({ ...config, validateStatus: (status) => status === HttpStatusCode.Ok }),
		refetchOnMount: 'always',
		networkMode: 'always',
		enabled: AuthService.getHasAccessToken()
	})
}

export function useGetUserProfileQuery() {
	return useQuery(getUserProfileQuery())
}
