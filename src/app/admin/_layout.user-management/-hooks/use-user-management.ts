import { IUserManagement } from '@/common/types/entities'
import { UserManagement } from '@/services/user-management.service'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export enum UserManagementQueryKeys {
	GET_USER = 'GET_USER_MANAGEMENT',
	DELETE_USER = 'DELETE_USER_MANAGEMENT',
	UPDATE_USER = 'UPDATE_USER_MANAGEMENT'
}

type TQueryKey = readonly [UserManagementQueryKeys.GET_USER]

export function useGetUserManagement(
	options?: Partial<UseQueryOptions<ResponseBody<IUserManagement[]>, AxiosError, IUserManagement[], TQueryKey>>
) {
	return useQuery({
		queryKey: [UserManagementQueryKeys.GET_USER],
		queryFn: UserManagement.getUsers,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []),
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		...options
	})
}

export function useDeleteUserManagement() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [UserManagementQueryKeys.DELETE_USER],
		mutationFn: (id: number) => UserManagement.softDeleteUser(id),

		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
			queryClient.invalidateQueries({
				queryKey: [UserManagementQueryKeys.GET_USER]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message =
				error.response?.data?.message || error.response?.data?.error || t('ns_common:notification.error')
			toast.error(message)
		}
	})
}

export function useUpdateUserManagement() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [UserManagementQueryKeys.UPDATE_USER],
		mutationFn: UserManagement.updateUser,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({ queryKey: [UserManagementQueryKeys.GET_USER] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})
}
