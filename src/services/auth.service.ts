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

	static logout() {
		useAuthStore.getState().resetCredentials() // reset auth state
		queryClient.clear() // clear cached queries
		queryClient.removeQueries({ type: 'all', exact: false }) // remove all triggered queries
		queryClient.cancelQueries({ fetchStatus: 'fetching' }) // cancel all running queries
		window.dispatchEvent(new Event('LOGOUT'))
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

	static async refreshToken(id: string): Promise<ResponseBody<string>> {
		try {
			return await axiosInstance.get(`/refresh-token/${id}`)
		} catch {
			AuthService.logout()
		}
	}

	static getAccessToken(): string | null {
		const accessToken = useAuthStore.getState().token
		return isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	static setAccessToken(token: string): void {
		useAuthStore.getState().setAccessToken(token)
	}

	static getHasAccessToken(): boolean {
		const accessToken = useAuthStore.getState().token
		return !isNil(accessToken)
	}
	static async updatePassword(newPassword: string) {
		return await axiosInstance.patch(`/change-password`, newPassword)
	}
}
