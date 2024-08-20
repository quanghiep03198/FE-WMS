import { ResourceKeys } from 'i18next'

export const warehouseImportType: Record<'A' | 'B' | 'C' | 'D', ResourceKeys['ns_inoutbound']> = {
	A: 'inventory_list_type.A',
	B: 'inventory_list_type.B',
	C: 'inventory_list_type.C',
	D: 'inventory_list_type.D'
} as const
