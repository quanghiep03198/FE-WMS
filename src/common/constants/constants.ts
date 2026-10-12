import type { ResourceKeys } from 'i18next'
import { Languages } from './enums'

type LocaleOptions = ReadonlyArray<{ value: Languages; label: string }>

export const FALLBACK_VALUE = 'Unknown'

export const LOCALES: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
]

export const TRANSLATED_FACTORY: Readonly<
	Record<
		FactoryCode,
		Extract<ResourceKeys['ns_common'], 'factory.VA1' | 'factory.VB1' | 'factory.VB2' | 'factory.CA1'>
	>
> = {
	VA1: 'factory.VA1',
	VB1: 'factory.VB1',
	VB2: 'factory.VB2',
	CA1: 'factory.CA1'
}
