import { ICompany, IUser } from '@/common/types/entities'
import { generateAvatar } from '@/common/utils/generate-avatar'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type AuthState = {
	user: IUser | null
	accessToken: string | null
	setUserProfile: (profile: Partial<IUser>) => void
	setUserCompany: (company: Omit<ICompany, 'factory_code'>) => void
	setAccessToken: (accessToken: string) => void
	resetCredentials: () => void
}

const initialState = { user: null, accessToken: null }

export const useAuthStore = create(
	immer(
		persist<AuthState>(
			(set, get) => ({
				...initialState,
				setUserProfile: (profile: IUser) => {
					const state = get()
					set({
						user: {
							...state.user,
							...profile,
							picture: generateAvatar({ name: profile?.display_name })
						}
					})
				},
				setAccessToken: (accessToken: string) => {
					set({ accessToken })
				},
				setUserCompany: (company: Omit<ICompany, 'factory_code'>) => {
					const state = get()
					set({ user: { ...state.user, ...company } })
				},
				resetCredentials: () => {
					console.log(1)
					set({ user: null, accessToken: null })
				}
			}),
			{
				name: 'credentials'
			}
		)
	)
)
