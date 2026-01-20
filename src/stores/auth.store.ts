import { FactoryCode } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import generateAvatar from '@/common/utils/generate-avatar'
import { shared } from 'use-broadcast-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface IAuthState {
	user: IUser | null
	token: string
	setUserProfile: (profile: Partial<IUser>) => void
	setCurrentFactory: (factoryCode: FactoryCode) => void
	setAccessToken: (token: string, meta?: { expires_time: string }) => void
	resetCredentials: () => void
}

const initialState: Pick<IAuthState, 'user' | 'token'> = { user: null, token: null }

export const useAuthStore = create(
	shared(
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
)
