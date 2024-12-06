export default {
	fields: {
		area: 'Area (m²)',
		is_default: 'Default',
		is_disable: 'Disabled',
		manager: 'Manager',
		new_storage_location: 'New storage location',
		new_warehouse: 'New warehouse',
		original_storage_location: 'Original storage location',
		original_warehouse: 'Original warehouse',
		storage_name: 'Storage name',
		storage_num: 'Storage code',
		storage_position: 'Storage position',
		transfered_warehouse: 'Transfered warehouse',
		type_storage: 'Storage type',
		type_warehouse: 'Warehouse type',
		warehouse_name: 'Warehouse name',
		warehouse_num: 'Warehouse code'
	},
	form: {
		add_warehouse_title: 'Create New Warehouse',
		update_warehouse_title: 'Update Warehouse'
	},
	headings: {
		storage_list_description: 'Manage storage location information',
		storage_list_title: 'Storage Location List',
		warehouse_list_description: 'Manage warehouse information',
		warehouse_list_title: 'Warehouse List'
	},
	specialized_vocabs: {
		storage_area: 'Storage area',
		warehouse: 'Warehouse'
	},
	storage_types: {
		finished_production_area: 'Finished production area',
		inbound_staging_area: 'Inbound staging area',
		inspection_holding_area: 'Product inspection area',
		main_area: 'Main area',
		outbound_staging_area: 'Outbound staging area'
	},
	warehouse_types: {
		finished_production_warehouse: 'Finished production warehouse',
		half_finished_production: 'Half-finished production warehouse',
		material_warehouse: 'Material warehouse',
		production_warehouse: 'Production warehouse',
		scrap_production_warehouse: 'Scrap production warehouse'
	}
} as const
