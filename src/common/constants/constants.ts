import { ResourceKeys } from 'i18next'
import { Languages } from './enums'

type LocaleOptions = Array<{ value: Languages; label: string }>

export const locales: LocaleOptions = [
	{ value: Languages.VIETNAMESE, label: 'Vietnamese' },
	{ value: Languages.ENGLISH, label: 'English' },
	{ value: Languages.CHINESE, label: 'Chinese' }
] as const

export const warehouseTypes: Record<'A' | 'B' | 'C' | 'D' | 'E', ResourceKeys['ns_warehouse']> = {
	A: 'warehouse_types.production_warehouse',
	B: 'warehouse_types.material_warehouse',
	C: 'warehouse_types.half_finished_production',
	D: 'warehouse_types.finished_production_warehouse',
	E: 'warehouse_types.scrap_production_warehouse'
} as const

export const warehouseStorageTypes: Record<'A' | 'B' | 'C' | 'D' | 'E', ResourceKeys['ns_warehouse']> = {
	A: 'storage_types.main_area',
	B: 'storage_types.finished_production_area',
	C: 'storage_types.inspection_holding_area',
	D: 'storage_types.outbound_staging_area',
	E: 'storage_types.inbound_staging_area'
} as const
