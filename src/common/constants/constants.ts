import env from '../utils/env'
import { Languages } from './enums'

type LocaleOptions = Array<{ value: Languages; label: string }>

export const locales: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
] as const

export const RFID_READER_HOSTS = {
	vi: [env('VITE_TEST_DB_HOST'), env('VITE_PRODUCTION_DB_HOST'), env('VITE_VN_DB_HOST_01'), env('VITE_VN_DB_HOST_02')],
	km: [env('VITE_KM_DB_HOST_01'), env('VITE_KM_DB_HOST_02')]
} as const
