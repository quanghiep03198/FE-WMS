import {
	PermissionValueDTO,
	UpdatePermissionDTO
} from '@/app/admin/_layout.permission-management/-schemas/permission-form-value.schema'
import { IPermission } from '@/common/types/entities'
import { PermissionService } from '@/services/permission.service'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
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
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [PermissionQueryKeys.SOFT_DEL_PERMISSION],
		mutationFn: (id: number) => PermissionService.softDeletePermission(id),

		onSuccess: () => {
			toast.success('Permission deleted successfully')
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message = error.response?.data?.message || error.response?.data?.error || 'Failed to delete permission'
			toast.error(message)
		}
	})
}

export function useInsertPermission() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [PermissionQueryKeys.INSERT_PERMISSION],
		mutationFn: (payload: Omit<PermissionValueDTO, 'keyid'>) => PermissionService.insertPermission(payload),

		onSuccess: () => {
			toast.success('Permission insert successfully')
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message = error.response?.data?.message || error.response?.data?.error || 'Failed to insert permission'
			toast.error(message)
		}
	})
}

export function useUpdatePermission() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: [PermissionQueryKeys.UPDATE_PERMISSION],
		mutationFn: ({ id, payload }: { id: number; payload: UpdatePermissionDTO }) =>
			PermissionService.updatePermission(id, payload),

		onSuccess: () => {
			toast.success('Permission update successfully')
			queryClient.invalidateQueries({
				queryKey: [PermissionQueryKeys.GET_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message = error.response?.data?.message || error.response?.data?.error || 'Failed to update permission'
			toast.error(message)
		}
	})
}
