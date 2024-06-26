import { generateAvatar } from '@/common/utils/generate-avatar'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import { UseMutateAsyncFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCookieState, useDeepCompareLayoutEffect, useEventListener, useLocalStorageState } from 'ahooks'
import { SetState } from 'ahooks/lib/createUseStorageState'
import { AxiosError, AxiosResponse } from 'axios'
import _, { isNil } from 'lodash'
import { compress, decompress } from 'lz-string'
import React, { createContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
	const queryClient = useQueryClient()

	const [user, setUser] = useLocalStorageState<Partial<IUser>>(StorageService.USER_KEY, {
		defaultValue: undefined,
		listenStorageChange: true,
		serializer: (data) => compress(JSON.stringify(data)),
		deserializer: (data) => JSON.parse(decompress(data))
	})

	const [accessToken, setAccessToken] = useLocalStorageState<string>(StorageService.ACCESS_TOKEN_KEY, {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const [userCompany, setUserCompany] = useLocalStorageState<string>(StorageService.USER_COMPANY_KEY, {
		defaultValue: undefined,
		listenStorageChange: true
	})

	const { t } = useTranslation()

	const { mutateAsync: logout } = useMutation({
		mutationKey: ['auth', accessToken],
		mutationFn: AuthService.revokeAccessToken,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSettled: (_data, _error, _variabled, context) => {
			AuthService.logout().finally(() => toast.success(t('ns_auth:notification.logout_success'), { id: context }))
		}
	})

	// Get user profile after login successfully
	const { data, isSuccess, isError } = useQuery({
		queryKey: ['auth', accessToken],
		queryFn: AuthService.profile,
		staleTime: 5 * 60 * 1000,
		enabled: Boolean(accessToken),
		select: (data) => data.metadata
	})

	// Check authenticated status every time get profile query is triggered
	useDeepCompareLayoutEffect(() => {
		if (data && isSuccess) setUser({ ...data, picture: generateAvatar({ name: data.display_name }) })
		if (isError) AuthService.logout()
	}, [data, isSuccess, isError])

	// Listen log out event
	useEventListener('logout', () => {
		queryClient.clear()
		setUser(undefined)
		setAccessToken(undefined)
		setUserCompany(undefined)
	})

	const isAuthenticated = useMemo(() => [user, accessToken].every((item) => !_.isNil(item)), [user, accessToken])

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
