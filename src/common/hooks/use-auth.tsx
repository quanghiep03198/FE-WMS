import { USER_PROVIDE_TAG } from '@/app/(auth)/_apis/auth.api'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { isNil } from 'lodash'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
/**
 * @summary Custom hook that provides authentication-related functionality.
 */
export function useAuth() {
	const { t } = useTranslation()
	const authStore = useAuthStore()
	const queryClient = useQueryClient()

	const { mutateAsync: logout } = useMutation({
		mutationKey: [USER_PROVIDE_TAG],
		mutationFn: AuthService.revokeToken,
		onMutate: () => {
			const queryCache = queryClient.getQueryCache()
			const queryKeys = queryCache.getAll().reduce<QueryKey>((accumulator, currentQuery) => {
				if (currentQuery.state.status === 'pending')
					return [...accumulator, ...currentQuery.queryKey.filter((key) => !!key)]
				else return accumulator
			}, [])
			queryClient.cancelQueries({ queryKey: queryKeys })
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSettled: (_data, _error, _variable, context) => {
			AuthService.logout()
			toast.success(t('ns_auth:notification.logout_success'), { id: context })
		}
	})

	const isAuthenticated = !isNil(authStore.user) && !isNil(authStore.user?.company_code) && !isNil(authStore.token)

	return {
		...authStore,
		isAuthenticated,
		logout
	}
}
