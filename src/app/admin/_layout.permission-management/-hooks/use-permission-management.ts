import { IPermission } from '@/common/types/entities'
import { PermissionService } from '@/services/permission.service'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export enum PermissionQueryKeys {
	GET_PERMISSION = 'GET_PERMISSION',
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
				queryKey: [PermissionQueryKeys.SOFT_DEL_PERMISSION]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message = error.response?.data?.message || error.response?.data?.error || 'Failed to delete permission'
			toast.error(message)
		}
	})
}
