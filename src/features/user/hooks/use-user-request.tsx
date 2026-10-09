import { UserService } from '@features/user/services/user.service'
import { useMutation, useQuery } from '@tanstack/react-query'
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
	const { t } = useTranslation()

	return useMutation({
		meta: { invalidates: [[UserQueryKeys.USERS]] },
		mutationFn: UserService.createUser,
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'))
		}
	})
}

export const useUpdateUserMutation = () => {
	const { t } = useTranslation()

	return useMutation({
		meta: { invalidates: [[UserQueryKeys.USERS]] },
		mutationFn: UserService.updateUser,
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'))
		}
	})
}

export const useUpdateUserStatusMutation = () => {
	const { t } = useTranslation()

	return useMutation({
		meta: { invalidates: [[UserQueryKeys.USERS]] },
		mutationFn: UserService.updateUserStatus,
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
		},
		onError: () => {
			toast.error(t('ns_common:notification.error'))
		}
	})
}

export const useDeleteUserMutation = () => {}
