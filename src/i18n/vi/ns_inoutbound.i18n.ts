import { OrderStatus } from '@/common/constants/enums'

export default {
	action_types: {
		warehouse_input: 'Nhập kho',
		warehouse_output: 'Xuất kho'
	},
	notification: {
		confirm_delete_all_mono: {
			description: 'Nếu bạn xóa hết, thao tác quét epc sẽ phải thực hiện lại',
			title: 'Bạn chắc chắn muốn xóa chỉ lệnh này ?'
		},
		exchange_order_caution:
			'Sau khi đổi chỉ lệnh sẽ không thể thao tác đổi ngược lại, hãy chắc chắn trước khi bấm xác nhận đổi chỉ lệnh.',
		invalid_epc_deteted:
			'EPC không hợp lệ được phát hiện. Vui lòng liên hệ với bộ phận thành hình để giải quyết vấn đề này, sau đó chuyển chúng đến tái chế',
		navigation_blocked_caption: 'Các tác vụ chưa được lưu. Bạn chắc chắn muốn rời khỏi trang ngay bây giờ?',
		navigation_blocked_message: 'Dừng đọc EPC ngay bây giờ ?',
		too_many_mono: 'Có nhiều hơn 3 chỉ lệnh được quét. Hãy kiểm tra lại.'
	},
	counter_box: {
		caption: 'Dữ liệu EPC được truyền liên tục từ máy chủ khi kết nối được thiết lập.',
		label: 'Số lượng EPC đã quét'
	},
	description: {
		exchange_all: 'Bạn có thể hoán đổi toàn bộ EPC thuộc mã thành phẩm kích cỡ đã chọn',
		exchange_epc_dialog_desc: 'Cho phép người dùng thay thế hoặc cập nhật tem EPC hiện tại sang chỉ lệnh mới.',
		exchange_qty: 'Số lượng sản phẩm được hoán đổi cho đơn hàng thực tế',
		inbound_report: 'Theo dõi và quản lý tiến độ nhập hàng kho thành phẩm',
		inoutbound_form_note: 'Ngắt kết nối trước khi thao tác nhập/xuất',
		no_exchangable_order: 'Chỉ những tem có cùng mã thành phẩm và size mới có thể đổi.',
		order_size_detail:
			'Xem thông tin chi tiết số lượng của từng size theo chỉ lệnh sản xuất. Bạn có thể bù tem nếu cần thiết.',
		order_sizing_list: 'Bảng dưới đây biểu thị danh sách chi tiết số lượng của từng Size theo chỉ lệnh',
		select_database:
			'Chọn kết nối database để đọc dữ liệu. Bạn có thể thay đổi khi không có kết nối nào hoặc kết nối hiện tại đã ngắt',
		select_order: 'Chọn chỉ lệnh sản xuất để xem dữ liệu EPC đã quét được và thao tác nhập hoặc xuất kho',
		select_rfid_process: 'Chọn quy trình sản xuất để quét tem tương ứng với các bộ phận đang nhiệm',
		transferred_order: 'Chỉ lệnh thực cần hoán đổi',
		transfer_order_datalist: 'Chọn dữ liệu từ bảng dưới để thêm đơn chuyển kho mới',
		transfer_order_list: 'Theo dõi và quản lý các đơn chuyển kho'
	},
	errors: {
		wrong_stamp: 'Dán sai tem'
	},
	inoutbound_actions: {
		normal_export: 'Xuất kho bình thường',
		normal_import: 'Nhập kho bình thường',
		recycling: 'Phân loại lại hàng hóa',
		return_for_repair: 'Hàng trả về để sửa chữa',
		scrap: 'Báo phế',
		transfer_inbound: 'Điều động nhập kho',
		transfer_outbound: 'Điều động xuất kho'
	},
	labels: {
		delete_all: 'Xóa tất cả',
		exchange_all: 'Hoán đổi tất cả',
		io_archive_warehouse: 'Kho lưu trữ',
		io_reason: 'Lý do nhập/xuất',
		io_storage_location: 'Vị trí lưu kho',
		order_information: 'Thông tin đơn hàng',
		transfer_information: 'Thông tin chuyển kho'
	},
	mo_no_box: {
		caption: 'Bạn có thể tùy chọn các chỉ lệnh được sủ dụng để thao tác nhập/xuất',
		order_count: 'Đã quét {{ count }} đơn hàng'
	},
	order_status: {
		[OrderStatus.APPROVED]: 'Đã duyệt',
		[OrderStatus.CANCELLED]: 'Đã hủy duyệt',
		[OrderStatus.NOT_APPROVED]: 'Chờ duyệt',
		[OrderStatus.REAPPROVED]: 'Duyệt lại'
	},
	rfid_process: {
		cutting_inbound: 'Quét tem pha cắt',
		production_management_inbound: 'Quét tem kho QLSX',
		shaping_inbound: 'Quét tem định hình'
	},
	scanner_setting: {
		adjust_setting_description: 'Điều chỉnh cài đặt RFID Playground',
		cron_job: 'Trạng thái quét',
		data_synchronization: 'Đồng bộ dữ liệu',
		developer_mode: 'Chế độ phát triển',
		developer_mode_note: 'Bật chế độ phát triển để sử dụng các tính năng nâng cao hơn',
		fetch_oder_data_note: 'Cho phép bạn tải các dữ liệu EPC cũ hơn chưa thực hiện thao tác nhập/xuất',
		fetch_older_data: 'Lấy dữ liệu cũ',
		internet_access: 'Kết nối mạng',
		latency: 'Độ trễ',
		network_status: 'Trạng thái kết nối',
		polling_duration: 'Tần suất',
		polling_duration_description:
			'Kiểm soát tần suất quét: giá trị thấp hơn có nghĩa là quét nhanh hơn, tuy nhiên nó có thể gây ra lưu lượng truy cập cao hơn cho máy chủ.',
		polling_duration_note: 'Chọn tần suất trước khi thao tác quét',
		preserve_log: 'Giữ log',
		preserve_log_note: 'Không xóa nhật ký khi thiết lập lại',
		synchronization_trigger: 'Kích hoạt đồng bộ',
		synchronization_trigger_description: 'Kích hoạt cuộc gọi API để đồng bộ dữ liệu từ API của khách hàng nếu cần.',
		toggle_fullscreen: 'Chuyển đổi chế độ toàn màn hình',
		toggle_fullscreen_note: 'Sử dụng chế độ toàn màn hình để có góc nhìn rộng hơn',
		transferred_data: 'Dữ liệu đã chuyển'
	},
	titles: {
		exchange_epc: 'Hoán đổi EPC',
		exchange_order: 'Hoán đổi đơn hàng',
		inbound_report: 'Báo cáo nhập kho',
		order_sizing_list: 'Danh sách Size theo đơn',
		transfer_order_datalist: 'Dữ liệu đơn chuyển kho',
		transfer_order_list: 'Danh sách đơn chuyển kho'
	}
}
