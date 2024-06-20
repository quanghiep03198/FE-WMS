export default {
	fields: {
		warehouse_num: 'Mã kho',
		warehouse_name: 'Tên kho',
		type_warehouse: 'Loại kho',
		storage_position: 'Vị trí',
		is_disable: 'Đã hủy',
		is_default: 'Đánh dấu là mặc định',
		area: 'Diện tích (m²)',
		manager: 'Người quản lý'
	},
	warehouse_types: {
		production_warehouse: 'Kho hàng gia công',
		material_warehouse: 'Kho nguyên liệu',
		half_finished_production: 'Kho bán thành phẩm',
		finished_production_warehouse: 'Kho thành phẩm',
		scrap_production_warehouse: 'Kho phế phẩm'
	},
	form: {
		add_warehouse_title: 'Tạo mới kho',
		update_warehouse_title: 'Cập nhật mới kho'
	},
	headings: {
		warehouse_list_title: 'Quản lý kho',
		warehouse_list_description: 'Bảng dưới đây hiển thị danh sách thông tin của tất cả các kho hàng'
	}
} as const
