import { Locale } from '@/common/constants/enums'
import { JsonHandler } from '@/common/utils/json-handler'
import _ from 'lodash'

export class StorageService {
	static getLocale = () => {
		const locale = localStorage.getItem('i18nextLng')
		return (JsonHandler.safeParse(locale) ?? Locale.EN) as Locale
	}

	static getUser = () => {
		const user = localStorage.getItem('user')
		return JsonHandler.safeParse(user)
	}

	static getUserCompany = () => {
		return JsonHandler.safeParse(localStorage.getItem('userCompany'))
	}

	static getAccessToken = (): string | null => {
		const accessToken = JsonHandler.safeParse<string>(localStorage.getItem('accessToken'))
		return _.isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	static setAccessToken = (refreshToken: string): void => {
		localStorage.setItem('accessToken', JSON.stringify(refreshToken))
	}

	static logout = () => {
		localStorage.clear()
		window.dispatchEvent(new Event('logout', { cancelable: false }))
	}
}
