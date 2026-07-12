import type { IUser } from '@/features/auth/types'
import type { FactoryCode } from '@common/constants/enums'
import { shared } from 'use-broadcast-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthState {
	user: IUser | null
	accessToken: string | null
	setAccessToken: (token: string) => void
	setUserProfile: (profile: Partial<IUser>) => void
	setCurrentFactory: (factoryCode: FactoryCode) => void
	resetCredentials: () => void
}

const initialState: Pick<IAuthState, 'user' | 'accessToken'> = { user: null, accessToken: null }

export const useAuthStore = create(
	shared(
		persist<IAuthState>(
			(set, get) => ({
				...initialState,
				setAccessToken: (accessToken: string) => {
					set((prev) => ({ ...prev, accessToken }))
				},
				setUserProfile: (profile: IUser) => {
					const state = get()
					set({
						...state,
						user: {
							...state.user,
							...profile
						}
					})
				},
				setCurrentFactory: (factoryCode: FactoryCode) => {
					const state = get()
					set({ user: { ...state.user, current_factory_code: factoryCode } })
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
