import { UserService } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

export enum UserQueryKeys {
	GET_USERS = 'GET_USERS'
}

export const useGetUsersQuery = () => {
	return useQuery({
		queryKey: [UserQueryKeys.GET_USERS],
		queryFn: UserService.getUsers,
		select: (response) => response.metadata
	})
}
