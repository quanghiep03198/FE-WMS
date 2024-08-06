import { LoginFormValues } from '@/app/(auth)/login/_schemas/login.schema'
import { IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { queryClient } from '@/providers/query-client-provider'
import { IAuthState, useAuthStore } from '@/stores/auth.store'
import { type AxiosRequestConfig } from 'axios'
import { isNil } from 'lodash'

export class AuthService {
	static async login(data: LoginFormValues): Promise<ResponseBody<Pick<IAuthState, 'user' | 'token'>>> {
		return await axiosInstance.post('/login', data)
	}

	static async logout(): Promise<void> {
		useAuthStore.getState().resetCredentials() // reset auth state
		queryClient.clear() // clear cached queries
	}

	static async profile(config?: AxiosRequestConfig): Promise<IUser> {
		return await axiosInstance.get('/profile', config)
	}

	static getCredentials(): IAuthState['user'] {
		return useAuthStore.getState().user
	}

	static async revokeToken(): Promise<ResponseBody<null>> {
		return await axiosInstance.post<void, ResponseBody<null>>('/logout')
	}

	static async refreshToken(id: IUser['user_code']): Promise<ResponseBody<string>> {
		return await axiosInstance.get(`/refresh-token/${id}`)
	}

	static getAccessToken(): string | null {
		const accessToken = useAuthStore.getState().token
		return isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	static setAccessToken(accessToken: string): void {
		useAuthStore.setState((state) => ({ ...state, accessToken }))
	}

	static getHasAccessToken(): boolean {
		const accessToken = useAuthStore.getState().token
		return !isNil(accessToken)
	}
}
