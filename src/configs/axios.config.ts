import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { HttpStatusCode, type AxiosError, type AxiosInstance } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

const API_BASE_URL = env('VITE_API_BASE_URL')
const REQUEST_TIMEOUT = 60_000

let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: AxiosError, token: string) => {
	failedQueue.forEach(({ resolve, reject }) => {
		error ? reject(error) : resolve(token)
	})
	failedQueue = []
}

const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: REQUEST_TIMEOUT,
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
		const responseStatus = error.response?.status

		if (originalRequest && !originalRequest.retry && responseStatus === HttpStatusCode.Unauthorized) {
			console.error('[ERROR] ::: Log in session has expired.')

			const user = AuthService.getCredentials()
			if (!user?.id) {
				AuthService.logout()
				return Promise.reject(new Error('User could not be found'))
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`
						return axiosInstance(originalRequest)
					})
					.catch((err) => Promise.reject(err))
			}

			originalRequest.retry = true
			isRefreshing = true

			try {
				const response = await AuthService.refreshToken(user?.id)
				AuthService.setAccessToken(response.metadata)
				error.config.headers.Authorization = `Bearer ${response.metadata}`
				processQueue(null, response.metadata)
				return axiosInstance.request(originalRequest)
			} catch (error) {
				processQueue(error, null)
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
