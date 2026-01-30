import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export enum UserQueryKeys {
	USERS = 'USERS'
}

export const useGetUsersQuery = () => {
	return useQuery({
		queryKey: [UserQueryKeys.USERS],
		queryFn: UserService.getUsers,
		select: (response) => response.metadata
	})
}

export const useCreateUserMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: UserService.createUser,
		onSuccess: invalidateQueries
	})
}

export const useUpdateUserStatusMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: UserService.updateUserStatus,
		onSuccess: invalidateQueries
	})
}

export const useDeleteUserMutation = () => {}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({ predicate: (query) => query.queryKey.some((key) => key === UserQueryKeys.USERS) })
	}
}
