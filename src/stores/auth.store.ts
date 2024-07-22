import { ICompany, IUser } from '@/common/types/entities'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type AuthState = {
	user: IUser | null
	setUserProfile: (profile: IUser) => void
	setUserCompany: (company: Omit<ICompany, 'factory_code'>) => void
	resetAuthState: () => void
}

const initialState = { user: null }

export const useAuthStore = create(
	immer(
		persist<AuthState>(
			(set, get) => ({
				...initialState,
				setUserProfile: (profile: IUser) => {
					const state = get()
					set({ user: { ...state.user, ...profile } })
				},
				setUserCompany: (company: Omit<ICompany, 'factory_code'>) => {
					const state = get()
					set({ user: { ...state.user, ...company } })
				},
				resetAuthState: () => set(initialState)
			}),
			{
				name: 'user'
			}
		)
	)
)
