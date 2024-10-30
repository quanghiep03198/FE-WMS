export default {
	settings: {
		language: 'Ngôn ngữ',
		theme: 'Chế độ nền',
		function: 'Chức năng',
		font: 'Phông chữ'
	},

	common_fields: {
		created_at: 'Ngày tạo',
		updated_at: 'Ngày cập nhật',
		user_name_updated: 'Người cập nhật gần nhất',
		actions: 'Thao tác',
		remark: 'Ghi chú',
		approver: 'Người phê duyệt',
		approver_time: 'Thời gian phê duyệt',
		quantity: 'Số lượng',
		total: 'Tổng cộng'
	},
	actions: {
		add: 'Thêm mới',
		adjust: 'Điều chỉnh',
		update: 'Chỉnh sửa',
		delete: 'Xóa',
		back: 'Quay lại',
		open: 'Mở',
		close: 'Đóng',
		start: 'Bắt đầu',
		continue: 'Tiếp tục',
		dismiss: 'Bỏ qua',
		stop: 'Dừng',
		reset: 'Đặt lại',
		finish: 'Hoàn thành',
		connect: 'Kết nối',
		disconnect: 'Ngắt kết nối',
		save: 'Lưu',
		save_changes: 'Lưu thay đổi',
		revert_changes: 'Hủy thay đổi',
		select: 'Chọn',
		cancel: 'Hủy',
		submit: 'Xác nhận',
		proceed: 'Tiếp tục',
		confirm: 'Xác nhận',
		detail: 'Chi tiết',
		login: 'Đăng nhập',
		logout: 'Đăng xuất',
		search: 'Tìm kiếm',
		reload: 'Tải lại',
		clear_filter: 'Xóa lọc',
		toggle_sidebar: 'Đóng/Mở Thanh Menu',
		toggle_theme: 'Chuyển đổi chế độ nền',
		set_approval_status: 'Đặt trạng thái phê duyệt',
		approve: 'Duyệt',
		reapprove: 'Duyệt lại',
		cancel_approve: 'Hủy duyệt',
		retry: 'Thử lại',
		load_more: 'Tải thêm'
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
			'Bạn chắc chắn muốn xóa các bạn ghi đã chọn? Dữ liệu sẽ bị xóa hoàn toàn và không thể khôi phục',
		understand_and_proceed: 'Tôi hiểu và muốn tiếp tục'
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
	titles: {
		caution: 'Cảnh báo',
		general_settings: 'Cài đặt chung'
	},
	status: {
		connecting: 'Đang kết nối',
		connected: 'Đã kết nối',
		disconnected: 'Đã ngắt kết nối',
		running: 'Đang hoạt động',
		idle: 'Không hoạt động',
		processing: 'Đang xử lý',
		loading: 'Đang tải ...'
	}
} as const
