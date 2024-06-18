export default {
	fields: {
		warehouse_num: '库位编号',
		warehouse_name: '库位名称',
		type_warehouse: '库位类型(库区)',
		storage_position: '位置',
		is_disable: '是否禁用',
		is_default: '是否默认',
		area: '面積(m²)',
		manager: '管理人'
	},
	warehouse_types: {
		production_warehouse: '產品倉庫',
		material_warehouse: '原料倉庫',
		half_finished_production: '半成品倉庫',
		finished_production_warehouse: '成品倉庫',
		scrap_production_warehouse: '廢品倉庫 '
	},
	form: {
		add_warehouse_title: '创建新仓库',
		update_warehouse_title: '更新仓库'
	}
} as const
