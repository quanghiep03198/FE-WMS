import { UserService } from '@features/user/services/user.service'
import useAuth from '@hooks/use-auth'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'
import { useEffect, useMemo, useRef } from 'react'

export enum AuthQueryKeys {
	PROFILE = 'PROFILE'
}

export const getUserProfileQuery = (enabled?: boolean, config?: AxiosRequestConfig) => {
	// const unexpectedErrorCodes = [AxiosError.ERR_NETWORK, AxiosError.ETIMEDOUT, AxiosError.ECONNABORTED]

	return queryOptions({
		queryKey: [AuthQueryKeys.PROFILE, config],
		queryFn: async () => await UserService.profile(config),
		refetchOnMount: 'always',
		refetchOnReconnect: 'always',
		networkMode: 'always',
		enabled,
		select: (response) => response.metadata
		// retry: ((failureCount, error) => {
		// 	if (unexpectedErrorCodes.includes(error.code!)) return enabled
		// 	return failureCount <= 2 && enabled
		// } )as Exclude<RetryValue>
	})
}

export const useGetUserProfileQuery = () => {
	const { isAuthenticated } = useAuth()
	const abortControllerRef = useRef<AbortController>(new AbortController())

	useEffect(() => {
		if (!isAuthenticated) {
			abortControllerRef.current.abort()
		} else {
			if (abortControllerRef.current.signal.aborted) {
				abortControllerRef.current = new AbortController()
			}
		}
	}, [isAuthenticated])

	const queryOptions = useMemo(() => {
		return getUserProfileQuery(isAuthenticated, { signal: abortControllerRef.current?.signal })
	}, [isAuthenticated, abortControllerRef.current.signal.aborted])

	return useQuery(queryOptions)
}

export const useUpdateProfileMutation = () => {
	return useMutation({
		meta: { invalidates: [[AuthQueryKeys.PROFILE]] },
		mutationFn: UserService.updateProfile
	})
}

export const useUpdatePasswordMutation = () => {
	return useMutation({
		meta: { invalidates: [[AuthQueryKeys.PROFILE]] },
		mutationFn: UserService.updatePassword
	})
}
