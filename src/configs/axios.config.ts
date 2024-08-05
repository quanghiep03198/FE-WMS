import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env('VITE_API_BASE_URL'),
	timeout: 10_000,
	paramsSerializer: (params) => {
		return qs.stringify(params, {
			skipNulls: true,
			format: 'RFC1738'
		})
	}
})

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = AuthService.getAccessToken() // default access token that stored in local storage
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
		if (error.config && !error.config.retry && error.response?.status === HttpStatusCode.Unauthorized) {
			console.error('[ERROR] ::: Log in session has expired.')
			error.config.retry = true
			const user = AuthService.getCredentials()

			if (!user?.id) {
				AuthService.logout()
				return Promise.reject(new Error('User could not be found'))
			}
			const isAccessTokenExpired = AuthService.getIsAccessTokenExpired()

			/**
			 * @summary If access token is expired, request for new access token then retry the request
			 */
			if (!isAccessTokenExpired) {
				error.config.headers.Authorization = AuthService.getAccessToken()
			} else {
				const response = await AuthService.refreshToken(user?.id)
				AuthService.setAccessToken(response.metadata)
				error.config.headers.Authorization = `Bearer ${response.metadata?.token}`
			}
			return await axiosInstance.request(error.config)
		}

		return Promise.reject(error)
	}
)

export default axiosInstance
