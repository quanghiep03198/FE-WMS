import { LoginFormValues } from '@/app/(auth)/login/-schemas/login.schema'
import axiosInstance from '@/configs/axios.config'
import { queryClient } from '@/providers/query-client-provider'
import { IAuthState, useAuthStore } from '@/stores/auth.store'
import { GenericAbortSignal } from 'axios'

export class AuthService {
	static async login(data: LoginFormValues): Promise<ResponseBody<Pick<IAuthState, 'user'>>> {
		return await axiosInstance.post('/login', data)
	}

	static logout() {
		useAuthStore.getState().resetCredentials() // * reset auth state
		queryClient.removeQueries({ type: 'all', exact: false }) // * remove all triggered queries
		queryClient.cancelQueries({ fetchStatus: 'fetching' }) // * cancel all running queries
		queryClient.clear() // * clear cached queries
	}

	static getCredentials(): IAuthState['user'] {
		return useAuthStore.getState().user
	}

	static async revokeToken(): Promise<ResponseBody<null>> {
		return await axiosInstance.post<void, ResponseBody<null>>('/logout')
	}

	static async refreshToken(signal: GenericAbortSignal): Promise<ResponseBody<string>> {
		try {
			return await axiosInstance.get('refresh-token', { signal })
		} catch {
			AuthService.logout()
		}
	}
}
