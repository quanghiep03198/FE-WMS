import { generateAvatar } from '@/common/utils/generate-avatar'
import { AuthService } from '@/services/auth.service'
import { UseMutateAsyncFunction, useMutation, useQuery } from '@tanstack/react-query'
import { useLocalStorageState } from 'ahooks'
import { SetState } from 'ahooks/lib/createUseStorageState'
import { AxiosError, AxiosResponse } from 'axios'
import React, { createContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IUser } from '../../common/types/entities'

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
	const { t } = useTranslation(['ns_common', 'ns_auth'])

	const [user, setUser] = useLocalStorageState<Partial<IUser>>('user', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [accessToken, setAccessToken] = useLocalStorageState<string>('accessToken', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [userCompany, setUserCompany] = useLocalStorageState<string>('userCompany', {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const { mutateAsync: logout } = useMutation({
		mutationKey: ['auth', accessToken],
		mutationFn: AuthService.logout,
		onSettled: () => {
			setUser(undefined)
			setAccessToken(undefined)
			setUserCompany(undefined)
		}
	})

	const { data, isSuccess, isError } = useQuery({
		enabled: Boolean(accessToken),
		staleTime: 5 * 60 * 1000,
		queryKey: ['auth', accessToken],
		queryFn: AuthService.profile,
		select: (data) => data.metadata
	})

	useEffect(() => {
		if (isError) logout()
		if (data && isSuccess) setUser({ ...data, picture: generateAvatar({ name: data?.display_name }) })
	}, [data, isSuccess, isError])

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: Boolean(user),
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
