import { AuthService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@stores/auth.store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
		meta: { invalidates: [/* DO NOT INVALIDATE ANY QUERIES, it will trigger unnecessary refetches */] },
		mutationFn: AuthService.revokeToken,
		onSettled: async () => {
			await queryClient.cancelQueries() // * cancel all running queries
			queryClient.clear() // * clear cached queries
			authStore.resetCredentials() // * reset auth state
			toast.success(t('ns_auth:notification.logout_success'))
		}
	})

	const isAuthenticated = !isNil(authStore.user)

	return { ...authStore, isAuthenticated, logout }
}
