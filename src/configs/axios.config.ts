import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { HttpStatusCode, type AxiosError, type AxiosErrorFilter, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

let isRefreshing = false
let failedQueue: Array<AxiosErrorFilter> = []

/**
 * Processes the failed request by resolving or rejecting each promise with the provided token or error.
 *
 * @param {AxiosError} error - The error to reject the promises with, or null if the token is valid.
 * @param {string} token - The token to resolve the promises with.
 * @return {void}
 */
const processRequestQueue = (error: AxiosError, token: string) => {
	failedQueue.forEach(({ resolve, reject }) => {
		error ? reject(error) : resolve(token)
	})
	failedQueue = []
}

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env('VITE_API_BASE_URL'),
	timeout: env('VITE_API_BASE_URL', 10_000),
	paramsSerializer: (params) => {
		return qs.stringify(params, {
			skipNulls: true,
			format: 'RFC1738'
		})
	}
})

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
	(response) => response.data,
	async (error: AxiosError) => {
		if (error.code === 'ECONNABORTED') {
			toast.error('Request timeout')
			return Promise.reject(new Error('Request timeout'))
		}

		const originalRequest = error.config
		const errorResponseStatus = error.response?.status

		if (originalRequest && !originalRequest.retry && errorResponseStatus === HttpStatusCode.Unauthorized) {
			console.error('[ERROR] ::: Log in session has expired.')

			const user = AuthService.getCredentials()
			if (!user?.id) {
				AuthService.logout()
				return Promise.reject(new Error('Invalid credentials'))
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`
						return axiosInstance(originalRequest)
					})
					.catch((error) => Promise.reject(error))
			}

			originalRequest.retry = true
			isRefreshing = true

			try {
				const response = await AuthService.refreshToken(user?.id)
				AuthService.setAccessToken(response.metadata)
				error.config.headers.Authorization = `Bearer ${response.metadata}`
				processRequestQueue(null, response.metadata)
				return axiosInstance.request(originalRequest)
			} catch (error) {
				processRequestQueue(error, null)
				AuthService.logout()
				return Promise.reject(error)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	}
)

export default axiosInstance
