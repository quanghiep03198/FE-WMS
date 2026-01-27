import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export enum AuthQueryKeys {
	PROFILE = 'PROFILE'
}

export const getUserProfileQuery = (config?: AxiosRequestConfig) => {
	const unexpectedErrorCodes = [AxiosError.ERR_NETWORK, AxiosError.ETIMEDOUT, AxiosError.ECONNABORTED]

	return queryOptions({
		queryKey: [AuthQueryKeys.PROFILE, config],
		queryFn: async () => await UserService.profile(config),
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

export const useGetUserProfileQuery = () => {
	return useQuery(getUserProfileQuery())
}

export const useUpdatePasswordMutation = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [AuthQueryKeys.PROFILE],
		mutationFn: UserService.updatePassword,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.PROFILE] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})
}
