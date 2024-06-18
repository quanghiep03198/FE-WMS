import { ResourceKeys } from 'i18next'

export const WarehouseTypes: Record<'A' | 'B' | 'C' | 'D' | 'E', ResourceKeys['ns_warehouse']> = {
	A: 'warehouse_types.production_warehouse',
	B: 'warehouse_types.material_warehouse',
	C: 'warehouse_types.half_finished_production',
	D: 'warehouse_types.finished_production_warehouse',
	E: 'warehouse_types.scrap_production_warehouse'
} as const
