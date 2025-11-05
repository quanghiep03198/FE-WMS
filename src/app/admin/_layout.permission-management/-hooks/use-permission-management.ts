import {
	PermissionValueDTO,
	UpdatePermissionDTO
} from '@/app/admin/_layout.permission-management/-schemas/permission-form-value.schema'
import { IPermission } from '@/common/types/entities'
import { PermissionService } from '@/services/permission.service'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export enum PermissionQueryKeys {
	GET_PERMISSION = 'GET_PERMISSION',
	INSERT_PERMISSION = 'INSERT_PERMISSION',
	UPDATE_PERMISSION = 'UPDATE_PERMISSION',
	SOFT_DEL_PERMISSION = 'SOFT_DELETE_PERMISSION'
}

type TQueryKey = readonly [PermissionQueryKeys.GET_PERMISSION]

export function useGetPermissionManagement(
	options?: Partial<UseQueryOptions<ResponseBody<IPermission[]>, AxiosError, IPermission[], TQueryKey>>
) {
	return useQuery({
		queryKey: [PermissionQueryKeys.GET_PERMISSION],
		queryFn: PermissionService.getPermission,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : []),
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		...options
	})
}

export function useSoftDeletePermission() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [PermissionQueryKeys.SOFT_DEL_PERMISSION],
		mutationFn: (id: number) => PermissionService.softDeletePermission(id),

		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message =
				error.response?.data?.message || error.response?.data?.error || t('ns_common:notification.error')
			toast.error(message)
		}
	})
}

export function useInsertPermission() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [PermissionQueryKeys.INSERT_PERMISSION],
		mutationFn: (payload: Omit<PermissionValueDTO, 'keyid'>) => PermissionService.insertPermission(payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message =
				error.response?.data?.message || error.response?.data?.error || t('ns_common:notification.error')
			toast.error(message)
		}
	})
}

export function useUpdatePermission() {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [PermissionQueryKeys.UPDATE_PERMISSION],
		mutationFn: ({ id, payload }: { id: number; payload: UpdatePermissionDTO }) =>
			PermissionService.updatePermission(id, payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message =
				error.response?.data?.message || error.response?.data?.error || t('ns_common:notification.error')
			toast.error(message)
		}
	})
}
