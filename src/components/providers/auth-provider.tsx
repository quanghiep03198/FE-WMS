import { generateAvatar } from '@/common/utils/generate-avatar'
import { AuthService } from '@/services/auth.service'
import { UseMutateAsyncFunction, keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { useDeepCompareEffect, useEventListener, useLocalStorageState } from 'ahooks'
import { SetState } from 'ahooks/lib/createUseStorageState'
import { AxiosError, AxiosResponse } from 'axios'
import { isNil } from 'lodash'
import React, { createContext, useEffect, useState } from 'react'
import { IUser } from '../../common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { toast } from 'sonner'

type TAuthContext = {
	isAuthenticated: boolean
	userCompany: string | undefined
	user: Partial<IUser> | undefined
	setUser: (value?: SetState<Partial<IUser>>) => void
	setUserCompany: (value?: SetState<string>) => void
	logout: UseMutateAsyncFunction<AxiosResponse<any, any>, AxiosError<unknown, any>, void, string | number>
}

export const AuthContext = createContext<TAuthContext>({
	isAuthenticated: false,
	user: undefined,
	userCompany: undefined,
	logout: () => undefined,
	setUserCompany: () => undefined,
	setUser: () => undefined
})

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useLocalStorageState<Partial<IUser>>('user', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [accessToken] = useLocalStorageState<string>('accessToken', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [userCompany, setUserCompany] = useLocalStorageState<string>('userCompany', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [isAuthenticated, setIsAuthenticated] = useState([user, accessToken].every((value) => !isNil(value)))

	const { mutateAsync: logout } = useMutation({
		mutationKey: ['auth', accessToken],
		mutationFn: AuthService.logout
	})

	// Get user profile after login successfully
	const { data, isSuccess, isError } = useQuery({
		queryKey: ['auth', accessToken],
		queryFn: AuthService.profile,
		enabled: !!accessToken,
		staleTime: 5 * 60 * 1000,
		select: (data) => data.metadata
	})

	// Check authenticated status every time get profile query is triggered
	useEffect(() => {
		if (data && isSuccess) {
			setUser({ ...data, picture: generateAvatar({ name: data?.display_name }) })
			setIsAuthenticated(true)
		}
	}, [data, isSuccess, isError])

	// Listen log out event
	useEventListener('logout', () => setIsAuthenticated(false))

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				userCompany,
				logout,
				setUserCompany,
				setUser
			}}>
			{children}
		</AuthContext.Provider>
	)
}
