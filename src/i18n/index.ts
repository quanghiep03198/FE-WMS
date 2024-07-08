import { Languages } from '@/common/constants/enums'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { resources, type Resources } from './i18n-resources'

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: resources,
		defaultNS: ['ns_common'],
		fallbackLng: Languages.ENGLISH,
		debug: false,
		cleanCode: true,
		saveMissing: true,
		supportedLngs: Object.values(Languages),
		lowerCaseLng: true,
		preload: Object.values(Languages),
		lng: localStorage.getItem('i18nextLng') ?? Languages.ENGLISH,
		interpolation: {
			escapeValue: false
		},
		react: {
			useSuspense: true
		}
	})

export { i18n, type Resources }

/**
 * @deprecated
 * Use local resources instead
	backend: {
		backends: [HttpBackend, resourcesToBackend((lng, ns) => import(`./locales/${lng}/${ns}.json`))],
		backendOptions: [
			{
				loadPath: '/locales/{{lng}}/{{ns}}.json'
			}
		]
	}
 */
