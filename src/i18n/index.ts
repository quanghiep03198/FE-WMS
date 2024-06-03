import { Language } from '@/common/constants/enums';
import { JsonHandler } from '@/common/utils/json-handler';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { initReactI18next } from 'react-i18next';

type LocaleOptions = Array<{ value: Language; label: string }>;

const locales: LocaleOptions = [
	{ value: Language.VI, label: 'Vietnamese' },
	{ value: Language.EN, label: 'English' },
	{ value: Language.CN, label: 'Chinese' }
];

i18n
	.use(initReactI18next)
	.use(ChainedBackend)
	.use(LanguageDetector)
	.init({
		backend: {
			backends: [HttpBackend, LocalStorageBackend],
			backendOptions: [
				{
					expirationTime: 7 * 24 * 60 * 60 * 1000 // 7 days
				},
				{
					loadPath: '/locales/{{lng}}/{{ns}}.json'
				}
			]
		},
		defaultNS: 'ns_common',
		preload: Object.values(Language),
		// ns: ['ns_common', 'ns_auth', 'ns_company'],
		lng: (() => {
			try {
				const persistedLng = localStorage.getItem('i18nextLng');
				console.log(persistedLng);
				return JsonHandler.isValid(persistedLng) ? JsonHandler.safeParse<any>(persistedLng) : Language.EN;
			} catch {
				return undefined;
			}
		})(),
		fallbackLng: Language.VI,
		// fallbackNS: ['common.ns'],
		saveMissing: true,
		appendNamespaceToMissingKey: true,
		debug: false,
		interpolation: {
			escapeValue: false
		},
		react: {
			useSuspense: true
		}
	});

export { i18n, locales };
