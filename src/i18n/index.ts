import { Locale } from '@/common/constants/enums'
import env from '@/common/utils/env'
import { JsonHandler } from '@/common/utils/json-handler'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ChainedBackend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { resources, type Resources } from './i18n-resources'

type LocaleOptions = Array<{ value: Locale; label: string }>

const locales: LocaleOptions = [
	{ value: Locale.VI, label: 'Vietnamese' },
	{ value: Locale.EN, label: 'English' },
	{ value: Locale.CN, label: 'Chinese' }
]

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(HttpBackend)
	.use(ChainedBackend)
	.init({
		resources: resources,
		defaultNS: 'ns_common',
		debug: env('VITE_NODE_ENV') === 'development',
		cleanCode: true,
		saveMissing: true,
		updateMissing: false,
		missingKeyNoValueFallbackToKey: true,
		appendNamespaceToMissingKey: true,
		preload: Object.values(Locale),
		lng: (() => {
			const persistedLng = localStorage.getItem('i18nextLng')
			return JsonHandler.safeParse<Locale>(persistedLng) ?? Locale.CN
		})(),
		fallbackLng: Locale.CN,
		interpolation: {
			escapeValue: false,
			defaultVariables: {}
		},
		react: {
			useSuspense: true
		}
	})

export { i18n, locales, type Resources }

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
