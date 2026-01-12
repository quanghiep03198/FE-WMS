import { RequestHeaders } from '@/common/constants/enums'
import { UnauthorizedError } from '@/common/errors'
import env from '@/common/utils/env'
import { i18n } from '@/i18n'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'
import { AppConfigs } from './app.config'

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

	constructor(baseURL: string, version: string = '1.0') {
		// * Instance configuration
		this.instance = axios.create({
			baseURL: baseURL,
			timeout: env('VITE_API_BASE_URL', 10_000),
			headers: {
				[RequestHeaders.CONTENT_TYPE]: 'application/json',
				[RequestHeaders.API_VERSION]: version
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
				config.headers[RequestHeaders.AUTHORIZATION] = config.headers[RequestHeaders.AUTHORIZATION] ?? accessToken
				config.headers[RequestHeaders.USER_COMPANY] = user?.company_code
				config.headers[RequestHeaders.ACCEPT_LANGUAGE] = locale
				return config
			},
			(error) => Promise.reject(error)
		)
		// * Instance response interceptor
		this.instance.interceptors.response.use(
			(response) => response.data,
			async (error: AxiosError<ResponseBody<unknown>>) => {
				if (error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED) {
					toast.error('Request timeout')
					return Promise.reject(new Error('Request timeout'))
				}
				if (this.NOTIFIABLE_ERROR_CODES.includes(error.response?.status)) {
					toast.error(error.response?.data?.message, { id: error.response?.data?.path, duration: 5000 })
				}

				const originalRequest = error.config
				const errorStatus = error.response?.status

				if (originalRequest && !originalRequest.retry && errorStatus === HttpStatusCode.Unauthorized) {
					const abortController = new AbortController()

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
					// * Marking the request is refreshing token
					this.isRefreshingToken = true

					const credentials = AuthService.getCredentials()
					if (!credentials?.username) {
						AuthService.logout()
						abortController.abort()
						toast.error(i18n.t('ns_auth:notification.authenticate_failed'))
					}

					try {
						if (!credentials?.username)
							throw new UnauthorizedError(i18n.t('ns_auth:notification.authenticate_failed'))
						const { metadata: refreshToken } = await AuthService.refreshToken(
							credentials.username,
							abortController.signal
						)
						AuthService.setAccessToken(refreshToken)
						this.processQueue(null, refreshToken)
						originalRequest.headers['Authorization'] = `Bearer ${refreshToken}`
						const response = await this.instance(originalRequest)
						originalRequest.retry = true
						return response
					} catch (error) {
						this.processQueue(error, null)
						return Promise.reject(error)
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

const axiosInstance = new AxiosClient(AppConfigs.BASE_API_URL, '1.0').instance

export default axiosInstance
