import { ICompany, IUser } from '@/common/types/entities'
import { generateAvatar } from '@/common/utils/generate-avatar'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface IAuthState {
	user: IUser | null
	token: string | null
	setUserProfile: (profile: Partial<IUser>) => void
	setUserCompany: (company: Omit<ICompany, 'factory_code'>) => void
	setAccessToken: (token: string, meta?: { expires_time: string }) => void
	resetCredentials: () => void
}

const initialState: Pick<IAuthState, 'user' | 'token'> = { user: null, token: null }

export const useAuthStore = create(
	immer(
		persist<IAuthState>(
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
				setAccessToken: (token) => {
					set({ token })
				},
				setUserCompany: (company: Omit<ICompany, 'factory_code'>) => {
					const state = get()
					set({ user: { ...state.user!, company } })
				},
				resetCredentials: () => {
					set(initialState)
				}
			}),
			{
				name: 'credentials'
			}
		)
	)
)
