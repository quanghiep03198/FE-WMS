import { UserService } from '@/services/user.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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

export const useUpdateUserMutation = () => {
	const invalidateQueries = useInvalidateQueries()

	return useMutation({
		mutationFn: UserService.updateUser,
		onSuccess: invalidateQueries
	})
}

export const useUpdateUserStatusMutation = () => {
	const invalidateQueries = useInvalidateQueries()
	const { t } = useTranslation()
	const toastRef = useRef<string | number | null>(null)

	return useMutation({
		mutationFn: UserService.updateUserStatus,
		onMutate: () => {
			toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: () => {
			if (toastRef.current) {
				toast.success(t('ns_common:notification.success'), { id: toastRef.current })
			}
			invalidateQueries()
		},
		onError: () => {
			if (toastRef.current) {
				toast.error(t('ns_common:notification.error'), { id: toastRef.current })
			}
		}
	})
}

export const useDeleteUserMutation = () => {}

const useInvalidateQueries = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({ predicate: (query) => query.queryKey.some((key) => key === UserQueryKeys.USERS) })
	}
}
