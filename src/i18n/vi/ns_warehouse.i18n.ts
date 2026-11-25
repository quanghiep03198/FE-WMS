export default {
	fields: {
		allocation_warehouse: 'Kho phân bổ',
		area: 'Diện tích (m²)',
		is_default: 'Đánh dấu là mặc định',
		is_disable: 'Đã hủy',
		manager: 'Người quản lý',
		new_storage_location: 'Vị trí lưu kho mới',
		new_warehouse: 'Kho mới',
		original_storage_location: 'Vị trí lưu kho gốc',
		original_warehouse: 'Kho gốc',
		storage_capacity: 'Sức chứa',
		storage_name: 'Vị trí lưu kho',
		storage_num: 'Mã vị trí lưu kho',
		storage_position: 'Vị trí kho',
		total_number_of_storage: 'Tổng số vị trí lưu kho',
		total_storage_capacity: 'Tổng sức chứa',
		transfered_warehouse: 'Kho chuyển phát',
		type_storage: 'Loại hình lưu kho',
		type_warehouse: 'Loại kho',
		warehouse_name: 'Tên kho',
		warehouse_num: 'Mã kho'
	},
	form: {
		add_storage_location_title: 'Thêm vị trí lưu kho mới',
		add_warehouse_title: 'Tạo mới kho',
		storage_location_note: 'Tên vị trí lưu kho phải duy nhất, không được trùng với các vị trí khác.',

		update_storage_location_title: 'Cập nhật vị trí lưu kho',
		update_warehouse_title: 'Cập nhật mới kho'
	},
	headings: {
		storage_list_description: 'Quản lý thông tin vị trí lưu kho',

		storage_list_title: 'Danh sách vị trí lưu kho',
		warehouse_list_description: 'Quản lý thông tin các kho',
		warehouse_list_title: 'Danh sách lý kho'
	},
	specialized_vocabs: {
		storage_area: 'Khu vực lưu trữ',

		warehouse: 'Kho'
	},
	storage_types: {
		finished_production_area: 'Khu vực thành phẩm',
		inbound_staging_area: 'Khu vực chờ hàng nhập',

		inspection_holding_area: 'Khu vực đợi kiểm tra',
		main_area: 'Khu vực bãi chính',
		outbound_staging_area: 'Khu vực chờ hàng xuất'
	},
	tenancy_warehouse: {
		'201.202': 'Kho thành phẩm Liên Thuấn 2',
		'5.1': 'Kho thành phẩm Cambodia',

		'80.2': 'Kho thành phẩm Liên Dinh'
	},

	warehouse_types: {
		finished_production_warehouse: 'Kho thành phẩm',
		half_finished_production: 'Kho bán thành phẩm',
		material_warehouse: 'Kho nguyên liệu',
		production_warehouse: 'Kho hàng gia công',
		scrap_production_warehouse: 'Kho phế phẩm'
	}
} as const
