import { LoginFormValues } from '@/app/(auth)/login/_schemas/login.schema'
import { IAccessToken, IUser } from '@/common/types/entities'
import axiosInstance from '@/configs/axios.config'
import { queryClient } from '@/providers/query-client-provider'
import { useAuthStore } from '@/stores/auth.store'
import { type AxiosRequestConfig } from 'axios'
import { isBefore } from 'date-fns'
import { isNil } from 'lodash'

export class AuthService {
	static async login(data: LoginFormValues) {
		return await axiosInstance.post<
			LoginFormValues,
			ResponseBody<{ user: Partial<IUser>; accessToken: IAccessToken }>
		>('/login', data)
	}

	static async logout(): Promise<void> {
		useAuthStore.getState().resetCredentials() // reset auth state
		queryClient.clear() // clear cached queries
	}

	static async profile(config?: AxiosRequestConfig): Promise<IUser> {
		return await axiosInstance.get('/profile', config)
	}

	static getCredentials() {
		return useAuthStore.getState().user
	}

	static async revokeToken(): Promise<ResponseBody<null>> {
		return await axiosInstance.post<void, ResponseBody<null>>('/logout')
	}

	static async refreshToken(id: IUser['user_code']) {
		return await axiosInstance.get<any, ResponseBody<IAccessToken>>(`/refresh-token/${id}`)
	}

	static getAccessToken(): string | null {
		const accessToken = useAuthStore.getState().accessToken?.token
		return isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	static getIsAccessTokenExpired(): boolean {
		const expiresTime = useAuthStore.getState().accessToken?.expires_time
		return isBefore(new Date(expiresTime), new Date())
	}

	static setAccessToken(accessToken: IAccessToken): void {
		useAuthStore.setState((state) => ({ ...state, accessToken: accessToken }))
	}

	static getHasAccessToken() {
		const accessToken = useAuthStore.getState().accessToken
		return !isNil(accessToken)
	}
}
