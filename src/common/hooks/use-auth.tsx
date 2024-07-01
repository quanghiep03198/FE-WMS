import { USER_PROVIDE_TAG } from '@/app/_composables/-user.composable'
import { AuthService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { compress, decompress } from 'lz-string'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ICompany, IUser } from '../types/entities'

type AuthState = {
	user: IUser | null
	accessToken: string | null
	isAuthenticated: boolean
	setAccessToken: (accessToken: string) => void
	setUserProfile: (profile: IUser) => void
	setUserCompany: (company: Omit<ICompany, 'factory_code'>) => void
	resetAuthState: () => void
}

const initialState = { user: null, accessToken: null, isAuthenticated: false }

export const useAuthStore = create(
	persist<AuthState>(
		(set, get) => ({
			...initialState,
			setAccessToken: (accessToken: string) => {
				const state = get()
				set({ ...state, isAuthenticated: true, accessToken: `Bearer ${accessToken}` })
			},
			setUserProfile: (profile: IUser) => {
				const state = get()
				set({ ...state, user: { ...state.user, ...profile } })
			},
			setUserCompany: (company: Omit<ICompany, 'factory_code'>) => {
				const state = get()
				set({
					...state,
					user: { ...state.user, ...company }
				})
			},
			resetAuthState: () => set(initialState)
		}),
		{
			name: 'Auth',
			serialize: (data) => compress(JSON.stringify(data)),
			deserialize: (data) => JSON.parse(decompress(data))
		}
	)
)

export function useAuth() {
	const { t } = useTranslation()
	const { user, isAuthenticated } = useAuthStore()

	const { mutateAsync: logout } = useMutation({
		mutationKey: [USER_PROVIDE_TAG],
		mutationFn: AuthService.revokeAccessToken,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSettled: (_data, _error, _variable, context) => {
			AuthService.logout().finally(() => toast.success(t('ns_auth:notification.logout_success'), { id: context }))
		}
	})

	return {
		user,
		isAuthenticated,
		logout
	}
}
