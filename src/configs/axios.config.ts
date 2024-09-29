import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { HttpStatusCode, type AxiosError, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

export class AxiosClient {
	public instance: AxiosInstance

	constructor(baseURL?: string) {
		// * Instance configuration
		this.instance = axios.create({
			baseURL: baseURL ?? env('VITE_API_BASE_URL'),
			timeout: env('VITE_API_BASE_URL', 10_000),
			headers: {
				['Content-Type']: 'application/json'
			},
			paramsSerializer: (params) => {
				return qs.stringify(params, {
					skipNulls: true,
					format: 'RFC1738'
				})
			}
		})
		// * Instance request interceptor
		this.instance.interceptors.request.use(
			(config) => {
				const accessToken = AuthService.getAccessToken()
				const locale = StorageService.getLocale()
				const user = AuthService.getCredentials()
				config.headers['Authorization'] = config.headers['Authorization'] ?? accessToken
				config.headers['X-User-Company'] = user?.company_code
				config.headers['Accept-Language'] = locale
				return config
			},
			(error) => Promise.reject(error)
		)
		// * Instance response interceptor
		this.instance.interceptors.response.use(
			(response) => response.data,
			async (error: AxiosError) => {
				if (error.code === 'ECONNABORTED') {
					toast.error('Request timeout')
					return Promise.reject(new Error('Request timeout'))
				}

				const originalRequest = error.config
				const errorStatus = error.response?.status

				if (originalRequest && !originalRequest.retry && errorStatus === HttpStatusCode.Unauthorized) {
					const user = AuthService.getCredentials()
					if (!user?.id) throw new Error('Failed to refresh token')
					try {
						const { metadata: refreshToken } = await AuthService.refreshToken(user.id)
						AuthService.setAccessToken(refreshToken)
						originalRequest.headers['Authorization'] = `Bearer ${refreshToken}`
						const response = await this.instance(originalRequest)
						originalRequest.retry = true
						return response
					} catch (error) {
						AuthService.logout()
						throw new Error('Failed to refresh token')
					}
				}

				return Promise.reject(error)
			}
		)
	}
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
