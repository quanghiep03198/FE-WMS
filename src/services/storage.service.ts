import { Languages } from '@/common/constants/enums'
import { __JSON__ } from '@/common/helpers/json'
import { AppConfigs } from '@/configs/app.config'
import _ from 'lodash'

export class StorageService {
	static getLocale() {
		const locale = localStorage.getItem(AppConfigs.I18N_STORAGE_KEY)
		return __JSON__.parse<Languages>(locale) ?? Languages.ENGLISH
	}
}
