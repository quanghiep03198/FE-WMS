import { Languages } from './enums'

type LocaleOptions = Array<{ value: Languages; label: string }>

export const locales: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
] as const

export const ROW_EXPANSION_COLUMN_ID = 'row-expansion-column' as const
export const ROW_SELECTION_COLUMN_ID = 'row-selection-column' as const
export const ROW_ACTIONS_COLUMN_ID = 'row-actions-column' as const
