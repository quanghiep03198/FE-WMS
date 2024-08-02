import { USER_PROVIDE_TAG } from '@/app/(auth)/_apis/auth.api'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import { isNil } from 'lodash'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function useAuth() {
	const { t } = useTranslation()
	const authStore = useAuthStore()

	const { mutateAsync: logout } = useMutation({
		mutationKey: [USER_PROVIDE_TAG],
		mutationFn: AuthService.revokeToken,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSettled: (_data, _error, _variable, context) => {
			AuthService.logout().finally(() => toast.success(t('ns_auth:notification.logout_success'), { id: context }))
		}
	})

	const isAuthenticated = !isNil(authStore.user)

	return {
		...authStore,
		isAuthenticated,
		logout
	}
}
