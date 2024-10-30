import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { HttpStatusCode, type AxiosError, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

type PromiseExecutor<T = unknown> = {
	resolve: (value: T) => void
	reject: (reason?: unknown) => void
}

export class AxiosClient {
	public instance: AxiosInstance
	private isRefreshingToken = false
	private unauthorizedRequestHandlers: Array<PromiseExecutor<string | null>> = []

	/**
	 * @description List of error codes that should be notified to the user
	 */
	private readonly NOTIFIABLE_ERROR_CODES = [
		HttpStatusCode.BadRequest,
		HttpStatusCode.Forbidden,
		HttpStatusCode.NotFound,
		HttpStatusCode.PayloadTooLarge,
		HttpStatusCode.Conflict,
		HttpStatusCode.TooManyRequests
	]

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
			async (error: AxiosError<ResponseBody<any>>) => {
				if (error.code === 'ECONNABORTED') {
					toast.error('Request timeout')
					return Promise.reject(new Error('Request timeout'))
				}
				if (this.NOTIFIABLE_ERROR_CODES.includes(error.response.status)) {
					toast.error(error.response?.data?.message, { id: error.response?.data?.path, duration: 5000 })
				}

				const originalRequest = error.config
				const errorStatus = error.response?.status

				if (originalRequest && !originalRequest.retry && errorStatus === HttpStatusCode.Unauthorized) {
					if (this.isRefreshingToken) {
						return new Promise((resolve, reject) => {
							this.unauthorizedRequestHandlers.push({ resolve, reject })
						})
							.then((token) => {
								originalRequest.headers['Authorization'] = `Bearer ${token}`
								return this.instance(originalRequest)
							})
							.catch((err) => {
								return Promise.reject(err)
							})
					}

					this.isRefreshingToken = true
					const user = AuthService.getCredentials()
					if (!user?.id) throw new Error('Failed to refresh token')
					try {
						const { metadata: refreshToken } = await AuthService.refreshToken(user.id)
						AuthService.setAccessToken(refreshToken)
						this.processQueue(null, refreshToken)
						originalRequest.headers['Authorization'] = `Bearer ${refreshToken}`
						const response = await this.instance(originalRequest)
						originalRequest.retry = true
						return response
					} catch (error) {
						this.processQueue(error, null)
						throw new Error('Failed to refresh token')
					} finally {
						this.isRefreshingToken = false
					}
				}

				return Promise.reject(error)
			}
		)
	}

	private processQueue(error, token = null) {
		this.unauthorizedRequestHandlers.forEach((promise) => {
			if (error) {
				promise.reject(error)
			} else {
				promise.resolve(token)
			}
		})
		this.unauthorizedRequestHandlers = []
	}
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
