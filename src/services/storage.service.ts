import { AppConfigs } from '@/configs/app.config'
import { Languages } from '@common/constants/enums'
import { Json } from '@common/utils/json'

export class StorageService {
	static getLocale() {
		const locale = localStorage.getItem(AppConfigs.I18N_STORAGE_KEY)
		return Json.parse<Languages>(locale) ?? Languages.ENGLISH
	}
}
