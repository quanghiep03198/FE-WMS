export default {
	fields: {
		warehouse_num: 'Warehouse code',
		warehouse_name: 'Warehouse name',
		type_warehouse: 'Warehouse type',
		storage_position: 'Storage position',
		is_disable: 'Disabled',
		is_default: 'Default',
		area: 'Area (m²)',
		manager: 'Manager',
		storage_num: 'Storage code',
		storage_name: 'Storage name',
		type_storage: 'Storage type'
	},
	// created_at: 'Created at',
	warehouse_types: {
		production_warehouse: 'Production warehouse',
		material_warehouse: 'Material warehouse',
		half_finished_production: 'Half-finished production warehouse',
		finished_production_warehouse: 'Finished production warehouse',
		scrap_production_warehouse: 'Scrap production warehouse'
	},
	storage_types: {
		main_area: 'Main area',
		finished_production_area: 'Finished production area',
		inspection_holding_area: 'Product inspection area',
		outbound_staging_area: 'Outbound staging area',
		inbound_staging_area: 'Inbound staging area'
	},
	form: {
		add_warehouse_title: 'Create New Warehouse',
		update_warehouse_title: 'Update Warehouse'
	},
	headings: {
		warehouse_list_title: 'Warehouse management',
		warehouse_detail_title: 'Warehouse storage location details'
	}
} as const
