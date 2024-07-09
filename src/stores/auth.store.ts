import { ICompany, IUser } from '@/common/types/entities'
import { compress, decompress } from 'lz-string'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthState = {
	user: IUser | null
	isAuthenticated: boolean
	setUserProfile: (profile: IUser) => void
	setUserCompany: (company: Omit<ICompany, 'factory_code'>) => void
	resetAuthState: () => void
}

const initialState = { user: null, accessToken: null, isAuthenticated: false }

export const useAuthStore = create(
	persist<AuthState>(
		(set, get) => ({
			...initialState,
			setUserProfile: (profile: IUser) => {
				const state = get()
				set({ ...state, isAuthenticated: true, user: { ...state.user, ...profile } })
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
