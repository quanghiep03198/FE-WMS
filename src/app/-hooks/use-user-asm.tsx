import useAuth from '@/common/hooks/use-auth'
import { UserService } from '@/services/user.service'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export enum AuthQueryKeys {
	PROFILE = 'PROFILE'
}

export const getUserProfileQuery = (enabled?: boolean, config?: AxiosRequestConfig) => {
	const unexpectedErrorCodes = [AxiosError.ERR_NETWORK, AxiosError.ETIMEDOUT, AxiosError.ECONNABORTED]

	return queryOptions({
		queryKey: [AuthQueryKeys.PROFILE, config],
		queryFn: async () => await UserService.profile(config),
		refetchOnMount: 'always',
		refetchOnReconnect: 'always',
		networkMode: 'always',
		enabled,
		select: (response) => response.metadata,
		retry: (failureCount, error) => {
			if (unexpectedErrorCodes.includes(error.code)) return enabled
			return failureCount <= 2 && enabled
		}
	})
}

export const useGetUserProfileQuery = () => {
	const { isAuthenticated } = useAuth()
	const abortControllerRef = useRef<AbortController>(null)

	if (!abortControllerRef.current) {
		abortControllerRef.current = new AbortController()
	}

	useEffect(() => {
		if (!isAuthenticated) {
			abortControllerRef.current.abort()
			abortControllerRef.current = null
		}
	}, [isAuthenticated])

	const queryOptions = useMemo(() => {
		return getUserProfileQuery(isAuthenticated, { signal: abortControllerRef.current.signal })
	}, [isAuthenticated, abortControllerRef.current.signal.aborted])

	return useQuery(queryOptions)
}

export const useUpdateProfileMutation = () => {
	const { t } = useTranslation()
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: [AuthQueryKeys.PROFILE],
		mutationFn: UserService.updateProfile,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			invalidateQueries()
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

export const useUpdatePasswordMutation = () => {
	const { t } = useTranslation()
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationKey: [AuthQueryKeys.PROFILE],
		mutationFn: UserService.updatePassword,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			invalidateQueries()
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			predicate: (query) => query.queryKey.some((key) => key === AuthQueryKeys.PROFILE)
		})
	}
}
