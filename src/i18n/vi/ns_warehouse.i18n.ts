export default {
	fields: {
		warehouse_num: 'Mã kho',
		warehouse_name: 'Tên kho',
		type_warehouse: 'Loại kho',
		storage_position: 'Vị trí',
		is_disable: 'Đã hủy',
		is_default: 'Đánh dấu là mặc định',
		area: 'Diện tích (m²)',
		manager: 'Người quản lý',
		storage_num: 'Mã vị trí lưu kho',
		storage_name: 'Tên vị trí lữu kho',
		type_storage: 'Loại hình lưu kho',
		original_warehouse: 'Kho gốc',
		original_storage_location: 'Vị trí lưu kho gốc',
		transfered_warehouse: 'Kho chuyển phát',
		new_warehouse: 'Kho mới',
		new_storage_location: 'Vị trí lưu kho mới',
		allocation_warehouse: 'Kho phân bổ'
	},
	warehouse_types: {
		production_warehouse: 'Kho hàng gia công',
		material_warehouse: 'Kho nguyên liệu',
		half_finished_production: 'Kho bán thành phẩm',
		finished_production_warehouse: 'Kho thành phẩm',
		scrap_production_warehouse: 'Kho phế phẩm'
	},
	storage_types: {
		main_area: 'Khu vực bãi chính',
		finished_production_area: 'Khu vực thành phẩm',
		inspection_holding_area: 'Khu vực đợi kiểm tra',
		outbound_staging_area: 'Khu vực chờ hàng xuất',
		inbound_staging_area: 'Khu vực chờ hàng nhập'
	},
	form: {
		add_warehouse_title: 'Tạo mới kho',
		update_warehouse_title: 'Cập nhật mới kho'
	},
	headings: {
		warehouse_list_title: 'Quản lý kho',
		warehouse_detail_title: 'Danh sách vị trí lưu kho chi tiết'
	}
} as const
