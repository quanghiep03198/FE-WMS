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
		type_storage: 'Storage type',
		original_warehouse: 'Original warehouse',
		original_storage_location: 'Original storage location',
		transfered_warehouse: 'Transfered warehouse',
		new_warehouse: 'New warehouse',
		new_storage_location: 'New storage location',
		allocation_warehouse: 'Allocation_warehouse'
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
		warehouse_list_title: 'Warehouse List',
		warehouse_list_description: 'Manage warehouse information',
		storage_list_title: 'Storage Location List',
		storage_list_description: 'Manage storage location information'
	}
} as const
