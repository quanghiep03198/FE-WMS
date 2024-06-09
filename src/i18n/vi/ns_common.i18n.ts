export default {
	language: 'Ngôn ngữ',
	theme: 'Chế độ nền',
	function: 'Chức năng',
	common_fields: {
		created_at: 'Ngày tạo',
		updated_at: 'Ngày cập nhật',
		actions: 'Thao tác',
		remark: 'Ghi chú'
	},
	actions: {
		add: 'Thêm mới',
		update: 'Chỉnh sửa',
		delete: 'Xóa',
		save: 'Lưu',
		cancel: 'Hủy',
		submit: 'Xác nhận',
		continue: 'Tiếp tuc',
		back: 'Quay lại',
		close: 'Đóng',
		login: 'Đăng nhập',
		logout: 'Đăng xuất',
		search: 'Tìm kiếm',
		toggle_sidebar: 'Đóng/Mở Thanh Menu',
		toggle_theme: 'Chuyển đổi chế độ nền'
	},
	table: {
		selected_rows: 'Đã chọn {{selectedRows}} dòng',
		page: 'Trang {{page}}',
		display: 'Hiển thị',
		filter: 'Bộ lọc',
		no_filter_applied: 'Bộ lọc không được áp dụng'
	},
	pagination: {
		next_page: 'Trang sau',
		previous_page: 'Trang trước',
		first_page: 'Trang đầu',
		last_page: 'Trang cuối'
	},
	navigation: {
		settings: 'Cài đặt',
		appearance: 'Giao diện',
		profile: 'Thông tin cá nhân',
		account: 'Tài khoản',
		keyboard_shortcut: 'Phím tắt',
		wh_dashboard: 'Màn hình chính',
		wh_management: 'Quản lý kho',
		wh_import_management: 'Quản lý nhập hàng',
		wh_export_management: 'Quản lý xuất hàng',
		wh_transfer_managment: 'Quản lý chuyển giao',
		wh_inventory_management: 'Quản lý tồn kho',
		wh_exchange_n_return_management: 'Quản lý nhận trả hàng',
		wh_report_management: 'Báo biểu'
	},
	notification: {
		processing_request: 'Đang xử lý yêu cầu ...',
		success: 'Thành công !',
		error: 'Đã có lỗi xảy ra !'
	},
	errors: {
		'404': 'Không Tìm Thấy Trang.',
		'404_message': 'Trang không tồn tại. Vui lòng kiểm tra lại đường dẫn.',
		'403': 'Yêu Cầu Quyền Truy Cập',
		'403_message': 'Bạn không được phép truy cập trang này.',
		'503': 'Tính Năng Không Khả Dụng',
		'503_message': 'Tính năng đang trong quá trình phát triển / bảo trì. Vui lòng thử lại sau'
	}
} as const
