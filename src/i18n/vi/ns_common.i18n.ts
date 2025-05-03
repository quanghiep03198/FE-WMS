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
		confirm: 'Xác nhận',
		connect: 'Kết nối',
		continue: 'Tiếp tục',
		decrement: 'Giảm số lượng',
		delete: 'Xóa',
		detail: 'Chi tiết',
		disconnect: 'Ngắt kết nối',
		dismiss: 'Bỏ qua',
		export: 'Xuất',
		finish: 'Hoàn thành',
		fold: 'Thu gọn',
		increment: 'Tăng số lượng',
		load_more: 'Tải thêm',
		login: 'Đăng nhập',
		logout: 'Đăng xuất',
		open: 'Mở',
		pin: 'Ghim',
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
		select_database: 'Chọn cơ sở dữ liệu',
		select_server: 'Chọn máy chủ',
		set_approval_status: 'Đặt trạng thái phê duyệt',
		start: 'Bắt đầu',
		stop: 'Dừng',
		submit: 'Xác nhận',
		toggle_sidebar: 'Đóng/Mở Thanh Menu',
		toggle_theme: 'Chuyển đổi chế độ nền',
		trigger: 'Kích hoạt',
		unpin_all_columns: 'Bỏ ghim tất cả cột',
		update: 'Chỉnh sửa'
	},
	common_fields: {
		actions: 'Thao tác',
		approver: 'Người phê duyệt',
		approver_time: 'Thời gian phê duyệt',
		created_at: 'Ngày tạo',
		factory_code: 'Xưởng',
		quantity: 'Số lượng',
		quantity_with_limit: 'Số lượng (tối đa {{limit}})',
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
		'500': 'Đã xảy ra lỗi',
		'500_message':
			'Chúng tôi xin lỗi về sự bất tiện này. Bạn có thể thử lại hành động trước đó, nếu vẫn không giải quyết được, vui lòng gửi phản hồi cho chúng tôi mô tả lỗi bạn gặp phải. Chúng tôi sẽ khắc phục nhanh nhất có thể.',
		'503': 'Tính Năng Không Khả Dụng',
		'503_message': 'Tính năng đang trong quá trình phát triển / bảo trì. Vui lòng thử lại sau',
		'301_rfid_moved_permanently': 'Vui lòng truy cập vào {{url}} để sử dụng tính năng này cho nhà máy {{factoryCode}}'
	},
	factory: {
		VA1: 'Liên Dinh',
		VB2: 'Liên Thuấn 2',
		CA1: 'KHRU'
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
		fp_inoutbound: 'Nhập xuất kho thành phẩm',
		fp_stock_out: 'Xuất hàng kho thành phẩm',
		import_management: 'Quản lý nhập hàng',
		inventory_management: 'Quản lý tồn kho',
		keyboard_shortcut: 'Phím tắt',
		pm_inbound: 'Nhập kho QLSX',
		cargo_weight_check: 'Kiểm tra & Cân Hàng',
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
		ellipsis_count: '... và {{count}} dữ liệu khác',
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
		active: 'Đang hoạt động',
		connected: 'Đã kết nối',
		connecting: 'Đang kết nối',
		disconnected: 'Đã ngắt kết nối',
		idle: 'Không hoạt động',
		loading: 'Đang tải ...',
		deactivated: 'Đã vô hiệu hóa',
		processing: 'Đang xử lý',
		running: 'Đang hoạt động'
	},
	table: {
		auto_refresh: 'Tự động làm mới',
		clear_sort: 'Xóa sắp xếp',
		filter: 'Bộ lọc',
		hide_column: 'Ẩn cột này',
		no_data: 'Không có dữ liệu',
		no_filter_applied: 'Bộ lọc không được áp dụng',
		no_match_result: 'Không có kết quả.',
		page: 'Trang {{page}}',
		pin_left: 'Ghim bên trái',
		pin_right: 'Ghim bên phải',
		refetch_interval: 'Thời gian làm mới (s)',
		reset_size: 'Đặt lại kích thước',
		rows_per_page: 'Số hàng mỗi trang',
		search_in_column: 'Tìm kiếm trong cột',
		selected_rows: 'Đã chọn {{selectedRows}} dòng',
		sort_asc: 'Sắp xếp tăng dần',
		sort_desc: 'Sắp xếp giảm dần',
		total_rows: '{{count}} bản ghi',
		unpin: 'Bỏ ghim'
	},
	titles: {
		caution: 'Cảnh báo',
		general_settings: 'Cài đặt chung',
		original_data: 'Dữ liệu gốc',
		target_data: 'Dữ liệu cập nhật'
	}
} as const
