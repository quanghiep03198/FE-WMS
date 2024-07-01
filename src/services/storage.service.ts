import { Languages } from '@/common/constants/enums'
import { JsonHandler } from '@/common/utils/json-handler'
import _ from 'lodash'

export class StorageService {
	static getLocale() {
		const locale = localStorage.getItem('i18nextLng')
		return (JsonHandler.safeParse(locale) ?? Languages.ENGLISH) as Languages
	}

	/**
	 * @deprecated
	 */
	static getAccessToken(): string | null {
		const accessToken = JsonHandler.safeParse<string>(localStorage.getItem('accessToken'))
		return _.isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	/**
	 * @deprecated
	 */
	static setAccessToken = (refreshToken: string): void => {
		localStorage.setItem('accessToken', JSON.stringify(refreshToken))
	}
}
