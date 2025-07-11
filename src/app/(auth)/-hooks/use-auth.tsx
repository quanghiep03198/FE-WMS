import { AuthService } from '@/services/auth.service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'

export const USER_PROVIDE_TAG = 'USER'

export function getUserProfileQuery(config?: AxiosRequestConfig) {
	const unexpectedErrorCodes = [AxiosError.ERR_NETWORK, AxiosError.ETIMEDOUT, AxiosError.ECONNABORTED]

	return queryOptions({
		queryKey: [USER_PROVIDE_TAG, config],
		queryFn: async () => await AuthService.profile(config),
		refetchOnMount: 'always',
		refetchOnReconnect: 'always',
		networkMode: 'always',
		enabled: AuthService.getHasAccessToken(),
		select: (response) => response.metadata,
		retry: (failureCount, error) => {
			if (unexpectedErrorCodes.includes(error.code)) return AuthService.getHasAccessToken()
			return failureCount <= 2 && AuthService.getHasAccessToken()
		}
	})
}

export function useGetUserProfileQuery() {
	return useQuery(getUserProfileQuery())
}
