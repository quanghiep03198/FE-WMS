import { Languages } from './enums'

type LocaleOptions = Array<{ value: Languages; label: string }>

export const locales: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
] as const
