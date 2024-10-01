import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Số lượng EPC đã quét',
		caption: 'Dữ liệu EPC được truyền liên tục từ máy chủ khi kết nối được thiết lập.'
	},
	mo_no_box: {
		caption: 'Bạn có thể tùy chọn các chỉ lệnh được sủ dụng để thao tác nhập/xuất',
		order_count: 'Đã quét {{ count }} đơn hàng'
	},
	action_types: {
		warehouse_input: 'Nhập kho',
		warehouse_output: 'Xuất kho'
	},
	inoutbound_actions: {
		normal_import: 'Nhập kho bình thường',
		normal_export: 'Xuất kho bình thường',
		scrap: 'Báo phế',
		transfer_outbound: 'Điều động xuất kho',
		transfer_inbound: 'Điều động nhập kho',
		recycling: 'Phân loại lại hàng hóa',
		return_for_repair: 'Hàng trả về để sửa chữa'
	},
	notification: {
		too_many_mono: 'Có nhiều hơn 3 chỉ lệnh được quét. Hãy kiểm tra lại.',
		navigation_blocked_message: 'Dừng đọc EPC ngay bây giờ ?',
		navigation_blocked_caption: 'Các tác vụ chưa được lưu. Bạn chắc chắn muốn rời khỏi trang ngay bây giờ?',
		confirm_delete_all_mono: {
			title: 'Bạn chắc chắn muốn xóa chỉ lệnh này ?',
			description: 'Nếu bạn xóa hết, thao tác quét epc sẽ phải thực hiện lại'
		}
	},
	labels: {
		// EPC import/export
		io_reason: 'Lý do nhập/xuất',
		io_archive_warehouse: 'Kho lưu trữ',
		io_storage_location: 'Vị trí lưu kho',
		order_information: 'Thông tin đơn hàng',
		transfer_information: 'Thông tin chuyển kho'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Chờ duyệt',
		[OrderStatus.APPROVED]: 'Đã duyệt',
		[OrderStatus.CANCELLED]: 'Đã hủy duyệt',
		[OrderStatus.REAPPROVED]: 'Duyệt lại'
	},
	titles: {
		transfer_order_list: 'Danh sách đơn chuyển kho',
		transfer_order_datalist: 'Dữ liệu đơn chuyển kho',
		order_sizing_list: 'Danh sách Size theo đơn'
	},
	description: {
		transfer_order_list: 'Theo dõi và quản lý các đơn chuyển kho',
		transfer_order_datalist: 'Chọn dữ liệu từ bảng dưới để thêm đơn chuyển kho mới',
		order_sizing_list: 'Bảng dưới đây biểu thị danh sách chi tiết số lượng của từng Size theo chỉ lệnh',
		inoutbound_form_note: 'Ngắt kết nối trước khi thao tác nhập/xuất',
		select_order: 'Chọn chỉ lệnh sản xuất để xem dữ liệu EPC đã quét được và thao tác nhập hoặc xuất kho',
		select_database:
			'Chọn kết nối database để đọc dữ liệu. Bạn có thể thay đổi khi không có kết nối nào hoặc kết nối hiện tại đã ngắt',
		order_size_detail:
			'Xem thông tin chi tiết số lượng của từng size theo chỉ lệnh sản xuất. Bạn có thể bù tem nếu cần thiết.',
		no_exchangable_order: 'Không có đơn hàng nào phù hợp'
	},
	rfid_toolbox: {
		network_status: 'Trạng thái kết nối',
		internet_access: 'Kết nối mạng',
		latency: 'Độ trễ',
		cron_job: 'Trạng thái quét',
		transferred_data: 'Dữ liệu đã chuyển',
		polling_duration: 'Tần suất',
		polling_duration_note: 'Chọn tần suất trước khi thao tác quét',
		polling_duration_description:
			'Kiểm soát tần suất quét: giá trị thấp hơn có nghĩa là quét nhanh hơn, tuy nhiên nó có thể gây ra lưu lượng truy cập cao hơn cho máy chủ.',
		toggle_fullscreen: 'Chuyển đổi chế độ toàn màn hình',
		toggle_fullscreen_note: 'Sử dụng chế độ toàn màn hình để có góc nhìn rộng hơn',
		preserve_log: 'Giữ log',
		preserve_log_note: 'Không xóa nhật ký khi thiết lập lại'
	}
}
