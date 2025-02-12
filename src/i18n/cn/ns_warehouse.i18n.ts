export default {
	specialized_vocabs: {
		warehouse: '仓库',
		storage_area: '库位'
	},
	fields: {
		warehouse_num: '库位编号',
		warehouse_name: '库位名称',
		type_warehouse: '库位类型(库区)',
		storage_position: '位置',
		is_disable: '是否禁用',
		is_default: '是否默认',
		area: '面積 (m²)',
		manager: '管理人',
		storage_num: '储位编号',
		storage_name: '储位名称',
		type_storage: '庫位類型(區位)',
		original_warehouse: '原倉庫',
		original_storage_location: '原庫位',
		transfered_warehouse: '調撥倉庫',
		new_warehouse: '新倉庫 ',
		new_storage_location: '新庫位',
		allocation_warehouse: '調撥倉庫'
	},
	warehouse_types: {
		production_warehouse: '產品倉庫',
		material_warehouse: '原料倉庫',
		half_finished_production: '半成品倉庫',
		finished_production_warehouse: '成品倉庫',
		scrap_production_warehouse: '廢品倉庫 '
	},
	storage_types: {
		main_area: '正式庫區',
		finished_production_area: '產品倉庫',
		inspection_holding_area: '待檢庫區',
		outbound_staging_area: '待出庫區',
		inbound_staging_area: '待入庫區'
	},
	form: {
		add_warehouse_title: '创建新仓库',
		update_warehouse_title: '更新仓库'
	},
	headings: {
		warehouse_list_title: '仓库列表',
		warehouse_list_description: '管理仓库信息',
		storage_list_title: '存储位置列表',
		storage_list_description: '管理存储位置信息'
	}
} as const
