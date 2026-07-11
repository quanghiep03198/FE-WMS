import type { LoginFormValues } from '@/app/(auth)/login/-schemas/login.schema'
// import { destroySharedSocket } from '@/common/hooks/use-socket-io'
import axiosInstance from '@/configs/axios.config'
import { queryClient } from '@/integrations/tanstack-query'

import type { IAuthState } from '@/stores/auth.store'
import { useAuthStore } from '@/stores/auth.store'
import type { GenericAbortSignal } from 'axios'

export type RefreshTokenResponse = ResponseBody<{ newAccessToken: string; newRefreshToken: string }>

export class AuthService {
	/**
	 * @description In-flight refresh promise. Shared across ALL callers (axios interceptor, socket hook, etc.)
	 * so that only ONE refresh request is ever in-flight at a time.
	 */
	private static __refreshTokenRequest: Promise<RefreshTokenResponse> | null = null

	static async login(data: LoginFormValues): Promise<ResponseBody<Pick<IAuthState, 'user' | 'accessToken'>>> {
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

	/**
	 * @description Refresh the access token. Deduplicated: if a refresh is already in-flight,
	 * subsequent callers receive the SAME promise instead of firing a new HTTP request.
	 * This prevents duplicate refresh calls from axios interceptor + socket hook + any other consumer.
	 */
	static async refreshToken(signal?: GenericAbortSignal): Promise<RefreshTokenResponse> {
		// If a refresh is already in-flight, piggyback on it
		if (AuthService.__refreshTokenRequest) {
			return AuthService.__refreshTokenRequest
		}

		AuthService.__refreshTokenRequest = axiosInstance
			.get<void, RefreshTokenResponse>('refresh-token', { signal })
			.finally(() => {
				// Clear the singleton promise so the next call can start a fresh refresh
				AuthService.__refreshTokenRequest = null
			})

		try {
			const response = await AuthService.__refreshTokenRequest
			useAuthStore.getState().setAccessToken(response.metadata.newAccessToken)

			return response
		} catch {
			AuthService.logout()
		}
	}
}
