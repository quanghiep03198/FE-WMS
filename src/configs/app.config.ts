import env from '@common/utils/env'
import { isIPv4 } from '@common/utils/ip'

export class AppConfigs {
	public static readonly I18N_STORAGE_KEY = 'i18nextLng'
	public static readonly QUERY_CLIENT_CACHE_STORAGE_KEY = 'queryClientOfflineCache'
	public static readonly TOAST_DURATION = 2000
	public static readonly BASE_API_URL = isIPv4(window.location.hostname)
		? env('VITE_API_BASE_URL')
		: env('VITE_API_BASE_CLF_URL')
	public static readonly BASE_WEBSOCKET_URL = isIPv4(window.location.hostname)
		? env('VITE_WEBSOCKET_URL')
		: env('VITE_WEBSOCKET_CLF_URL')
}
