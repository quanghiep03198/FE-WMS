export default {
	fields: {
		warehouse_num: 'Warehouse code',
		warehouse_name: 'Warehouse name',
		type_warehouse: 'Warehouse type',
		storage_position: 'Storage position',
		is_disable: 'Disabled',
		is_default: 'Default',
		area: 'Area (m²)',
		manager: 'Manager'
	},
	// created_at: 'Created at',
	warehouse_types: {
		production_warehouse: 'Production warehouse',
		material_warehouse: 'Material warehouse',
		half_finished_production: 'Half-finished production warehouse',
		finished_production_warehouse: 'Finished production warehouse',
		scrap_production_warehouse: 'Scrap production warehouse'
	},
	form: {
		add_warehouse_title: 'Create New Warehouse',
		update_warehouse_title: 'Update Warehouse'
	},
	headings: {
		warehouse_list_title: 'Warehouse management',
		warehouse_list_description: "The table below show list of all warehouses's information"
	}
} as const
