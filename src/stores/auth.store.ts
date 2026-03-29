import type { FactoryCode } from '@/common/constants/enums'
import type { IUser } from '@/common/types/entities'
import { shared } from 'use-broadcast-ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IAuthState {
	user: IUser | null
	setUserProfile: (profile: Partial<IUser>) => void
	setCurrentFactory: (factoryCode: FactoryCode) => void
	resetCredentials: () => void
}

const initialState: Pick<IAuthState, 'user'> = { user: null }

export const useAuthStore = create(
	shared(
		persist<IAuthState>(
			(set, get) => ({
				...initialState,
				setUserProfile: (profile: IUser) => {
					const state = get()
					set({
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
