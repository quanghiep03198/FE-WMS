import { ResourceKeys } from 'i18next'
import { Languages } from './enums'

type LocaleOptions = Array<{ value: Languages; label: string }>

export const locales: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
] as const

export const factories: Record<'VA1' | 'VB1' | 'VB2' | 'CA1', ResourceKeys['ns_common']> = {
	VA1: 'factory.VA1',
	VB1: 'factory.VB1',
	VB2: 'factory.VB2',
	CA1: 'factory.CA1'
}

export enum FactoryAgencyCode {
	VA1 = 'GL1',
	VB1 = 'GL2',
	VB2 = 'GL3',
	CA1 = 'GL4',
	MA1 = 'GL5'
}
