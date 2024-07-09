import { type AxiosRequestConfig } from 'axios'
import _ from 'lodash'
import { useAuthStore } from '@/stores/auth.store'
import { IUser } from '@/common/types/entities'
import { __JSON__ } from '@/common/utils/json'
import axiosInstance from '@/configs/axios.config'
import { queryClient } from '@/providers/query-client-provider'
import { LoginFormValues } from '@/schemas/auth.schema'
import { AppConfigs } from '@/configs/app.config'

export class AuthService {
	static async login(data: LoginFormValues): Promise<ResponseBody<{ user: Partial<IUser>; token: string }>> {
		return await axiosInstance.post<LoginFormValues, ResponseBody<{ user: Partial<IUser>; token: string }>>(
			'/login',
			data
		)
	}

	static async logout(): Promise<void> {
		localStorage.removeItem(AppConfigs.ACCESS_TOKEN_STORAGE_KEY) // remove persisted accessToken
		useAuthStore.getState().resetAuthState() // reset auth state
		queryClient.clear() // clear cached queries
	}

	static async profile(config?: AxiosRequestConfig): Promise<ResponseBody<IUser>> {
		return await axiosInstance.get<void, ResponseBody<IUser>>('/profile', config)
	}

	static getUser() {
		return useAuthStore.getState().user
	}

	static async revokeToken(): Promise<ResponseBody<null>> {
		return await axiosInstance.post<void, ResponseBody<null>>('/logout')
	}

	static async refreshToken(
		id: IUser['user_code'],
		requestConfig: Pick<AxiosRequestConfig, 'signal'>
	): Promise<ResponseBody<string>> {
		return await axiosInstance.get<void, ResponseBody<string>>(`/refresh-token/${id}`, requestConfig)
	}

	static getAccessToken(): string | null {
		if (!AuthService.getHasAccessToken()) return null
		const accessToken = __JSON__.parse<string>(localStorage.getItem(AppConfigs.ACCESS_TOKEN_STORAGE_KEY))
		return `Bearer ${accessToken}`
	}

	static setAccessToken(refreshToken: string): void {
		localStorage.setItem(AppConfigs.ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(refreshToken))
	}

	static getHasAccessToken() {
		const accessToken = __JSON__.parse<string>(localStorage.getItem(AppConfigs.ACCESS_TOKEN_STORAGE_KEY))
		return !_.isNil(accessToken)
	}
}
