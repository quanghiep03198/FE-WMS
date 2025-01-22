export default {
	actions: {
		add: 'Thêm mới',
		adjust: 'Điều chỉnh',
		approve: 'Duyệt',
		back: 'Quay lại',
		cancel: 'Hủy',
		cancel_approve: 'Hủy duyệt',
		clear_filter: 'Xóa lọc',
		close: 'Đóng',
		connect: 'Kết nối',
		continue: 'Tiếp tục',
		delete: 'Xóa',
		detail: 'Chi tiết',
		disconnect: 'Ngắt kết nối',
		dismiss: 'Bỏ qua',
		export: 'Xuất',
		finish: 'Hoàn thành',
		load_more: 'Tải thêm',
		login: 'Đăng nhập',
		logout: 'Đăng xuất',
		open: 'Mở',
		proceed: 'Tiếp tục',
		reapprove: 'Duyệt lại',
		reload: 'Tải lại',
		report_bug: 'Báo cáo lỗi',
		reset: 'Đặt lại',
		retry: 'Thử lại',
		revert_changes: 'Hủy thay đổi',
		save: 'Lưu',
		save_changes: 'Lưu thay đổi',
		search: 'Tìm kiếm',
		select: 'Chọn',
		set_approval_status: 'Đặt trạng thái phê duyệt',
		start: 'Bắt đầu',
		stop: 'Dừng',
		submit: 'Xác nhận',
		toggle_sidebar: 'Đóng/Mở Thanh Menu',
		toggle_theme: 'Chuyển đổi chế độ nền',
		trigger: 'Kích hoạt',
		update: 'Chỉnh sửa'
	},
	common_fields: {
		actions: 'Thao tác',
		approver: 'Người phê duyệt',
		approver_time: 'Thời gian phê duyệt',
		created_at: 'Ngày tạo',
		quantity: 'Số lượng',
		remark: 'Ghi chú',
		status: 'Trạng thái',
		total: 'Tổng cộng',
		updated_at: 'Ngày cập nhật',
		user_name_updated: 'Người cập nhật gần nhất'
	},
	common_form_titles: {
		create: 'Thêm mới {{object}}',
		update: 'Cập nhật {{object}}'
	},
	confirmation: {
		delete_description:
			'Bạn chắc chắn muốn xóa các bạn ghi đã chọn? Dữ liệu sẽ bị xóa hoàn toàn và không thể khôi phục',
		delete_title: 'Xóa (các) bản ghi đã chọn',
		understand_and_proceed: 'Tôi hiểu và muốn tiếp tục'
	},
	errors: {
		'403': 'Yêu Cầu Quyền Truy Cập',
		'403_message': 'Bạn không được phép truy cập trang này.',
		'404': 'Không Tìm Thấy Trang.',
		'404_message': 'Trang không tồn tại. Vui lòng kiểm tra lại đường dẫn.',
		'503': 'Tính Năng Không Khả Dụng',
		'503_message': 'Tính năng đang trong quá trình phát triển / bảo trì. Vui lòng thử lại sau'
	},
	form_placeholder: {
		fill: 'Nhập {{object}}...',
		search: 'Tìm kiếm {{object}} ...',
		select: '-- Chọn {{object}} --'
	},
	navigation: {
		account: 'Tài khoản',
		appearance: 'Giao diện',
		dashboard: 'Màn hình chính',
		export_management: 'Quản lý xuất hàng',
		fm_inoutbound: 'Nhập xuất kho thành phẩm',
		import_management: 'Quản lý nhập hàng',
		inventory_management: 'Quản lý tồn kho',
		keyboard_shortcut: 'Phím tắt',
		pm_inbound: 'Nhập kho QLSX',
		production_incoming_inspection: 'Quản lý nghiệm thu hàng vào',
		profile: 'Thông tin cá nhân',
		report_management: 'Báo biểu',
		settings: 'Cài đặt',
		storage_detail: 'Chi tiết vị trí lưu kho',
		transfer_managment: 'Quản lý chuyển giao',
		warehouse_management: 'Quản lý kho'
	},
	notification: {
		downloading: 'Đang tải xuống ...',
		establishing_connection: 'Đang thiết lập kết nối ...',
		error: 'Đã có lỗi xảy ra !',
		processing_request: 'Đang xử lý yêu cầu ...',
		success: 'Thành công !',
		receiving_data: 'Đang lấy dữ liệu ...'
	},
	others: {
		server: 'Máy chủ {{alias}}'
	},
	pagination: {
		first_page: 'Trang đầu',
		last_page: 'Trang cuối',
		next_page: 'Trang sau',
		previous_page: 'Trang trước'
	},
	settings: {
		font: 'Phông chữ',
		function: 'Chức năng',
		language: 'Ngôn ngữ',
		theme: 'Chế độ nền'
	},
	status: {
		connected: 'Đã kết nối',
		connecting: 'Đang kết nối',
		disconnected: 'Đã ngắt kết nối',
		idle: 'Không hoạt động',
		loading: 'Đang tải ...',
		processing: 'Đang xử lý',
		running: 'Đang hoạt động'
	},
	table: {
		filter: 'Bộ lọc',
		no_data: 'Không có dữ liệu',
		no_filter_applied: 'Bộ lọc không được áp dụng',
		no_match_result: 'Không có kết quả.',
		page: 'Trang {{page}}',
		problem_arises: 'Vấn đề phát sinh',
		rows_per_page: 'Số hàng mỗi trang',
		search_in_column: 'Tìm kiếm trong cột',
		selected_rows: 'Đã chọn {{selectedRows}} dòng'
	},
	titles: {
		caution: 'Cảnh báo',
		general_settings: 'Cài đặt chung'
	}
} as const
