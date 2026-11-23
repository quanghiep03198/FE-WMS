export default {
	fields: {
		allocation_warehouse: '調撥倉庫',

		area: '面積 (m²)',
		is_default: '是否默认',
		is_disable: '是否禁用',
		manager: '管理人',
		new_storage_location: '新庫位',
		new_warehouse: '新倉庫 ',
		original_storage_location: '原庫位',
		original_warehouse: '原倉庫',
		storage_capacity: '储位容量',
		storage_name: '储位名称',
		storage_num: '储位编号',
		storage_position: '位置',
		total_number_of_storage: '总储位数量',
		total_storage_capacity: '总储位容量',
		transfered_warehouse: '調撥倉庫',
		type_storage: '庫位類型(區位)',
		type_warehouse: '库位类型(库区)',
		warehouse_name: '库位名称',
		warehouse_num: '库位编号'
	},
	form: {
		add_storage_location_title: '添加新库位',
		add_warehouse_title: '创建新仓库',
		storage_location_note: '库位名称必须唯一, 不能与其他库位重复.',

		update_storage_location_title: '更新库位',
		update_warehouse_title: '更新仓库'
	},
	headings: {
		storage_list_description: '管理存储位置信息',

		storage_list_title: '存储位置列表',
		warehouse_list_description: '管理仓库信息',
		warehouse_list_title: '仓库列表'
	},
	specialized_vocabs: {
		storage_area: '库位',

		warehouse: '仓库'
	},
	storage_types: {
		finished_production_area: '產品倉庫',
		inbound_staging_area: '待入庫區',

		inspection_holding_area: '待檢庫區',
		main_area: '正式庫區',
		outbound_staging_area: '待出庫區'
	},
	tenancy_warehouse: {
		'201.202': '聯舜二成品倉',
		'5.1': '柬埔寨成品倉',

		'80.2': '聯盈成品倉 '
	},

	warehouse_types: {
		finished_production_warehouse: '成品倉庫',
		half_finished_production: '半成品倉庫',
		material_warehouse: '原料倉庫',
		production_warehouse: '產品倉庫',
		scrap_production_warehouse: '廢品倉庫 '
	}
} as const
