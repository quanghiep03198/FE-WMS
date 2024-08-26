import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { HttpStatusCode, type AxiosError, type AxiosErrorFilter, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

export class AxiosClient {
	public instance: AxiosInstance
	private isRefreshing: boolean = false
	private failedQueue: Array<AxiosErrorFilter> = []

	constructor(baseURL?: string) {
		// * Instance configuration
		this.instance = axios.create({
			baseURL: baseURL ?? env('VITE_API_BASE_URL'),
			timeout: env('VITE_API_BASE_URL', 10_000),
			headers: {
				'Content-Type': 'application/json'
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
				const errorResponseStatus = error.response?.status

				if (originalRequest && !originalRequest.retry && errorResponseStatus === HttpStatusCode.Unauthorized) {
					originalRequest.retry = true
					console.error('[ERROR] ::: Log in session has expired.')

					const user = AuthService.getCredentials()
					if (!user?.id) {
						AuthService.logout()
						return Promise.reject(new Error('Invalid credentials'))
					}

					// * Push all failed request due to expired token, then process them one by one
					if (this.isRefreshing) {
						return new Promise((resolve, reject) => {
							this.failedQueue.push({ resolve, reject })
						})
							.then((token) => {
								originalRequest.headers['Authorization'] = `Bearer ${token}`
								return this.instance(originalRequest)
							})
							.catch((error) => Promise.reject(error))
					}

					this.isRefreshing = true
					try {
						const response = await AuthService.refreshToken(user?.id)
						const refreshToken = response.metadata
						AuthService.setAccessToken(refreshToken)
						originalRequest.headers.Authorization = `Bearer ${refreshToken}`
						this.processRequestQueue(null, refreshToken)
					} catch (error) {
						this.processRequestQueue(error, null)
						AuthService.logout()
						return Promise.reject(error)
					} finally {
						this.isRefreshing = false
					}
				}

				return Promise.reject(error)
			}
		)
	}

	/**
	 * @private
	 * @description Processes the failed request by resolving or rejecting each promise with the provided token or error.
	 * @param {AxiosError} error - The error to reject the promises with, or null if the token is valid.
	 * @param {string} token - The token to resolve the promises with.
	 * @return {void}
	 */
	private processRequestQueue = (error: AxiosError, token: string): void => {
		this.failedQueue.forEach(({ resolve, reject }) => {
			error ? reject(error) : resolve(token)
		})
		this.failedQueue = []
	}
}

const axiosInstance = new AxiosClient().instance

export default axiosInstance
