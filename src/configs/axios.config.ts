import { Locale } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import env from '@/common/utils/env'
import { JsonHandler } from '@/common/utils/json-handler'
import { AuthService } from '@/services/auth.service'
import { StorageService } from '@/services/storage.service'
import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import _ from 'lodash'
import qs from 'qs'
import { toast } from 'sonner'

let retry = 0
const controller = new AbortController()

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env('VITE_API_BASE_URL'),
	signal: controller.signal,
	timeout: 5000,
	paramsSerializer: function (params) {
		return qs.stringify(params, { arrayFormat: 'brackets' })
	}
})

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = StorageService.getAccessToken()
		const locale = StorageService.getLocale()
		const userCompany = StorageService.getUserCompany()
		if (accessToken) config.headers['Authorization'] = accessToken
		if (userCompany) config.headers['X-User-Company'] = userCompany
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
			const persistedUser = StorageService.getUser()
			if (!persistedUser) {
				return Promise.reject(error)
			}
			const user = JsonHandler.safeParse<IUser>(persistedUser) as IUser
			if (retry > 1) {
				controller.abort()
				StorageService.logout()
				toast.error('Log in session has expired.')
				return Promise.reject(new Error('Failed to get refresh token'))
			}
			if (retry === 1) {
				await AuthService.refreshToken(user?.user_code, { signal: controller.signal })
					.then(({ metadata: refreshToken }) => axiosInstance.setAccessToken(refreshToken))
					.catch(() => {
						retry++
						controller.abort()
						return Promise.reject(new Error('Failed to get refresh token'))
					})
				return await axiosInstance
					.request<void, ResponseBody<string>>({ ...error.config, signal: controller.signal })
					.then((response) => {
						retry--
						axiosInstance.setAccessToken(response.metadata)
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
