import env from '@/common/utils/env'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

let retry = 0
const controller = new AbortController()

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env('VITE_API_BASE_URL'),
	signal: controller.signal,
	timeout: +env('VITE_REQUEST_TIMEOUT', 5000),
	paramsSerializer: (params) => {
		return qs.stringify(params, {
			arrayFormat: 'brackets',
			skipNulls: true
		})
	}
})

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = AuthService.getAccessToken() // default access token that stored in local storage
		const locale = StorageService.getLocale()
		const user = AuthService.getUser()
		config.headers['Authorization'] = config.headers['Authorization'] ?? accessToken
		config.headers['X-User-Company'] = user?.company_code
		config.headers['Accept-Language'] = locale

		return config
	},
	(error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		if (error.response?.status === HttpStatusCode.Unauthorized) {
			retry++
			console.error('[ERROR] ::: Log in session has expired.')
			const user = AuthService.getUser()
			if (!user) {
				return Promise.reject(error)
			}
			if (retry > 1) {
				toast.error('Log in session has expired.')
				/**
				 * @deprecated
				 * window.dispatchEvent(new Event('logout'))
				 * Migrated to zustand store
				 */
				AuthService.logout()
				controller.abort()
				return Promise.reject(new Error('Failed to get refresh token'))
			}
			if (retry === 1) {
				await AuthService.refreshToken(user?.user_code, { signal: controller.signal })
					.then(({ metadata: refreshToken }) => AuthService.setAccessToken(refreshToken))
					.catch(() => {
						retry++
						controller.abort()
						return Promise.reject(new Error('Failed to get refresh token'))
					})
				return await axiosInstance
					.request<void, ResponseBody<string>>({ ...error.config, signal: controller.signal })
					.then((response) => {
						retry--
						AuthService.setAccessToken(response.metadata)
						return response
					})
					.catch(() => {
						retry++
						controller.abort()
						return Promise.reject(new Error('Failed to retry previous request'))
					})
			}
		}
		return Promise.reject(error)
	}
)

export default axiosInstance
