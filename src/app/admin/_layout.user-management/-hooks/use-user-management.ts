import { IUserManagement } from '@/common/types/entities'
import { UserManagement } from '@/services/user-management.service'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export enum UserManagementQueryKeys {
	GET_USER = 'GET_USER_MANAGEMENT',
	DELETE_USER = 'DELETE_USER_MANAGEMENT'
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
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: [UserManagementQueryKeys.DELETE_USER],
		mutationFn: (id: number) => UserManagement.softDeleteUser(id),

		onSuccess: () => {
			toast.success('User deleted successfully')
			queryClient.invalidateQueries({
				queryKey: [UserManagementQueryKeys.GET_USER]
			})
		},

		onError: (error: AxiosError<any>) => {
			const message = error.response?.data?.message || error.response?.data?.error || 'Failed to delete user'
			toast.error(message)
		}
	})
}
