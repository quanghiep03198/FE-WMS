import { Languages } from '@/common/constants/enums'
import { _JSON } from '@/common/utils/json'
import { AppConfigs } from '@/configs/app.config'

export class StorageService {
	static getLocale() {
		const locale = localStorage.getItem(AppConfigs.I18N_STORAGE_KEY)
		return _JSON.parse<Languages>(locale) ?? Languages.ENGLISH
	}
}
