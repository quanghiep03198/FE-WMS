import { Languages } from '@/common/constants/enums'
import { __JSON__ } from '@/common/utils/json'
import { AppConfigs } from '@/configs/app.config'

export class StorageService {
	static getLocale() {
		const locale = localStorage.getItem(AppConfigs.I18N_STORAGE_KEY)
		return __JSON__.parse<Languages>(locale) ?? Languages.ENGLISH
	}
}
