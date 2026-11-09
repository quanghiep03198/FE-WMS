import { AppConfigs } from '@configs/app.config'

export function resolveImageUrl(url: string) {
	if (!url.startsWith('/files/')) return url
	return import.meta.env.DEV ? url : new URL(url, new URL(AppConfigs.BASE_API_URL, window.location.origin)).href
}
