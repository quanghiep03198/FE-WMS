import { AuthService } from '@features/auth/services/auth.service'
import { useAuthStore } from '@stores/auth.store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
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
	const navigate = useNavigate()

	const { mutateAsync: logout } = useMutation({
		mutationFn: AuthService.revokeToken,
		onSettled: async () => {
			await queryClient.cancelQueries({ type: 'all' }) // * cancel all running queries
			authStore.resetCredentials() // * reset auth state
			queryClient.removeQueries({ type: 'all', exact: false }) // * remove all triggered queries
			queryClient.clear() // * clear cached queries
			toast.success(t('ns_auth:notification.logout_success'))
			navigate({ to: '/login' })
		}
	})

	const isAuthenticated = !isNil(authStore.user)

	return { ...authStore, isAuthenticated, logout }
}
