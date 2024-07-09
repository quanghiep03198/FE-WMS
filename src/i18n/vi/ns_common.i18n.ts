export default {
	settings: {
		language: 'Ngôn ngữ',
		theme: 'Chế độ nền',
		function: 'Chức năng',
		font: 'Phông chữ'
	},
	specialized_vocabs: {
		warehouse: 'Kho',
		storage_area: 'Khu vực lưu trữ'
	},
	common_fields: {
		created_at: 'Ngày tạo',
		updated_at: 'Ngày cập nhật',
		actions: 'Thao tác',
		remark: 'Ghi chú',
		approver: 'Người phê duyệt',
		approver_time: 'Thời gian phê duyệt'
	},
	actions: {
		add: 'Thêm mới',
		update: 'Chỉnh sửa',
		delete: 'Xóa',
		back: 'Quay lại',
		open: 'Mở',
		close: 'Đóng',
		start: 'Bắt đầu',
		continue: 'Tiếp tục',
		stop: 'Dừng',
		reset: 'Đặt lại',
		finish: 'Hoàn thành',
		save: 'Lưu',
		select: 'Chọn',
		cancel: 'Hủy',
		submit: 'Xác nhận',
		confirm: 'Xác nhận',
		detail: 'Chi tiết',
		login: 'Đăng nhập',
		logout: 'Đăng xuất',
		search: 'Tìm kiếm',
		reload: 'Tải lại',
		clear_filter: 'Xóa lọc',
		toggle_sidebar: 'Đóng/Mở Thanh Menu',
		toggle_theme: 'Chuyển đổi chế độ nền'
	},
	table: {
		selected_rows: 'Đã chọn {{selectedRows}} dòng',
		page: 'Trang {{page}}',
		rows_per_page: 'Số hàng mỗi trang',
		filter: 'Bộ lọc',
		no_filter_applied: 'Bộ lọc không được áp dụng',
		no_data: 'Không có dữ liệu',
		search_in_column: 'Tìm kiếm trong cột',
		no_match_result: 'Không có kết quả.'
	},
	form_placeholder: {
		select: '-- Chọn {{object}} --',
		fill: 'Nhập {{object}}...',
		search: 'Tìm kiếm {{object}} ...'
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
		dashboard: 'Màn hình chính',
		inoutbound_commands: 'Thao tác nhập/xuất kho',
		warehouse_management: 'Quản lý kho',
		storage_detail: 'Chi tiết vị trí lưu kho',
		import_management: 'Quản lý nhập hàng',
		export_management: 'Quản lý xuất hàng',
		transfer_managment: 'Quản lý chuyển giao',
		inventory_management: 'Quản lý tồn kho',
		production_incoming_inspection: 'Quản lý nghiệm thu hàng vào',
		report_management: 'Báo biểu'
	},
	notification: {
		processing_request: 'Đang xử lý yêu cầu ...',
		success: 'Thành công !',
		error: 'Đã có lỗi xảy ra !'
	},
	confirmation: {
		delete_title: 'Xóa (các) bản ghi đã chọn',
		delete_description:
			'Bạn chắc chắn muốn xóa các bạn ghi đã chọn? Dữ liệu sẽ bị xóa hoàn toàn và không thể khôi phục'
	},
	errors: {
		'404': 'Không Tìm Thấy Trang.',
		'404_message': 'Trang không tồn tại. Vui lòng kiểm tra lại đường dẫn.',
		'403': 'Yêu Cầu Quyền Truy Cập',
		'403_message': 'Bạn không được phép truy cập trang này.',
		'503': 'Tính Năng Không Khả Dụng',
		'503_message': 'Tính năng đang trong quá trình phát triển / bảo trì. Vui lòng thử lại sau'
	},
	common_form_titles: {
		create: 'Thêm mới {{object}}',
		update: 'Cập nhật {{object}}'
	},
	status: {
		stopped: 'Đã dừng'
	}
} as const
