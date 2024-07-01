import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { LoginFormValues } from '@/schemas/auth.schema'
import { AxiosRequestConfig } from 'axios'
import _ from 'lodash'
import { BaseAbstractService } from './base.abstract.service'
import { useAuthStore } from '@/common/hooks/use-auth'
import { queryClient } from '@/providers/query-client-provider'

export class AuthService extends BaseAbstractService {
	public static readonly USER_KEY = 'user'
	public static readonly USER_COMPANY_KEY = 'userCompany'
	public static readonly ACCESS_TOKEN_KEY = 'accessToken'

	static async login(data: LoginFormValues) {
		return await axiosInstance.post<LoginFormValues, ResponseBody<{ token: string; accessToken?: string }>>(
			'/login',
			data
		)
	}

	static async profile() {
		return await axiosInstance.get<void, ResponseBody<IUser>>('/profile')
	}

	static async revokeAccessToken() {
		return await axiosInstance.post('/logout')
	}

	static async refreshToken(id: IUser['user_code'], requestConfig: Pick<AxiosRequestConfig, 'signal'>) {
		return await axiosInstance.get<void, ResponseBody<string>>(`/refresh-token/${id}`, requestConfig)
	}

	static async logout() {
		localStorage.removeItem('accessToken') // remove persisted accessToken
		useAuthStore.getState().resetAuthState() // reset auth state
		queryClient.clear() // clear cached queries
	}

	static getAccessToken() {
		return useAuthStore.getState().accessToken
	}

	static setAccessToken(accessToken: string) {
		return useAuthStore.getState().setAccessToken(accessToken)
	}

	static getUser() {
		return useAuthStore.getState().user
	}
}
