import { Locale } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import env from '@/common/utils/env'
import { JsonHandler } from '@/common/utils/json-handler'
import { AuthService } from '@/services/auth.service'
import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import _ from 'lodash'
import qs from 'qs'

let retry = 0
const controller = new AbortController()

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env('VITE_API_BASE_URL'),
	paramsSerializer: (params) => qs.stringify(params),
	timeout: 10000
})

axiosInstance.getLocale = function () {
	const locale = localStorage.getItem('i18nextLng')
	return (JsonHandler.safeParse(locale) ?? Locale.EN) as Locale
}
axiosInstance.getUser = function () {
	const locale = localStorage.getItem('user')
	return (JsonHandler.safeParse(locale) ?? Locale.EN) as Locale
}

axiosInstance.getAccessToken = function (): string | null {
	const accessToken = JsonHandler.safeParse<string>(localStorage.getItem('accessToken'))
	return _.isNil(accessToken) ? null : `Bearer ${accessToken}`
}
axiosInstance.setAccessToken = function (refreshToken: string): void {
	localStorage.setItem('accessToken', JSON.stringify(refreshToken))
}

axiosInstance.logout = function () {
	localStorage.removeItem('user')
	localStorage.removeItem('accessToken')
	localStorage.removeItem('userCompany')
}

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = axiosInstance.getAccessToken()
		const locale = axiosInstance.getLocale()
		if (accessToken) config.headers['Authorization'] = accessToken
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
			const persistedUser = localStorage.getItem('user')
			if (!persistedUser) {
				return Promise.reject(error)
			}
			const user = JsonHandler.safeParse<IUser>(persistedUser) as IUser
			if (retry > 1) {
				controller.abort()
				axiosInstance.logout()
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
