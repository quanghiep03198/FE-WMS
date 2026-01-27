import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { isNil } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
/**
 * @summary Custom hook that provides authentication-related functionality.
 */
export default function useAuth() {
	const { t } = useTranslation()
	const authStore = useAuthStore()
	const queryClient = useQueryClient()

	const { mutateAsync: logout } = useMutation({
		mutationFn: AuthService.revokeToken,
		onMutate: () => {
			const queryCache = queryClient.getQueryCache()
			const cancelledQueryKeys = queryCache.getAll().reduce<QueryKey>((accumulator, currentQuery) => {
				if (currentQuery.state.status === 'pending')
					return [...accumulator, ...currentQuery.queryKey.filter((key) => !!key)]
				else return accumulator
			}, [])
			queryClient.cancelQueries({ queryKey: cancelledQueryKeys })
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSettled: (_data, _error, _variable, context) => {
			AuthService.logout()
			toast.success(t('ns_auth:notification.logout_success'), { id: context })
		}
	})

	const isAuthenticated =
		!isNil(authStore.user) && !isNil(authStore.user?.current_factory_code) && !isNil(authStore.accessToken)

	return {
		...authStore,
		isAuthenticated,
		logout
	}
}
