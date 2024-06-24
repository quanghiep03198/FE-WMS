import { Languages } from '@/common/constants/enums'
import { JsonHandler } from '@/common/utils/json-handler'
import _ from 'lodash'
import { decompress } from 'lz-string'

export class StorageService {
	public static readonly USER_KEY = 'user'
	public static readonly USER_COMPANY_KEY = 'userCompany'
	public static readonly ACCESS_TOKEN_KEY = 'accessToken'

	static getLocale = () => {
		const locale = localStorage.getItem('i18nextLng')
		return (JsonHandler.safeParse(locale) ?? Languages.ENGLISH) as Languages
	}

	static getUser = () => {
		const user = localStorage.getItem(this.USER_KEY)
		return JsonHandler.safeParse(decompress(user))
	}

	static getUserCompany = () => {
		return JsonHandler.safeParse(localStorage.getItem(this.USER_COMPANY_KEY))
	}

	static getAccessToken = (): string | null => {
		const accessToken = JsonHandler.safeParse<string>(localStorage.getItem(this.ACCESS_TOKEN_KEY))
		return _.isNil(accessToken) ? null : `Bearer ${accessToken}`
	}

	static setAccessToken = (refreshToken: string): void => {
		localStorage.setItem('accessToken', JSON.stringify(refreshToken))
	}
}
