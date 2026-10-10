import type { IUser } from '@features/auth/types'
import { shared } from 'use-broadcast-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthState {
	user: Partial<IUser> | null
	accessToken: string | null
	setAccessToken: (token: string) => void
	setUserProfile: (profile: Partial<IUser>) => void
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
				setUserProfile: (profile: Partial<IUser>) => {
					const state = get()
					set({
						...state,
						user: {
							...state.user,
							...profile
						}
					})
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
