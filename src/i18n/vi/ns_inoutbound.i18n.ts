import { DefectiveGoodsSource } from '@/app/(features)/_layout.(defective-goods)/-constants'
import { OrderStatus } from '@/common/constants/enums'

export default {
	action_types: {
		warehouse_input: 'Nhập kho',
		warehouse_output: 'Xuất kho'
	},
	notification: {
		already_inbound_epcs:
			'Phát hiện các tem đã quét nhập kho trước đây, kiểm tra chi tiết sau đó thông báo lại bộ phận thành hình.',
		browser_tab_resumed: 'Chào mừng quay lại',
		browser_tab_resumed_message:
			'Do không có hoạt động trong một thời gian, kết nối đã bị ngắt tạm thời để tiết kiệm tài nguyên. Bạn có muốn kết nối lại không?',
		confirm_delete_all_mono: {
			description: 'Nếu bạn xóa hết, thao tác quét epc sẽ phải thực hiện lại',
			title: 'Bạn chắc chắn muốn xóa chỉ lệnh này ?'
		},
		exchange_order_caution:
			'Sau khi đổi chỉ lệnh sẽ không thể thao tác đổi ngược lại, hãy chắc chắn trước khi bấm xác nhận đổi chỉ lệnh.',
		invalid_epc_deteted:
			'Phát hiện EPC không hợp lệ. Vui lòng liên hệ bộ phận thành hình để xử lý, sau đó chuyển đến tái chế',
		navigation_blocked_caption: 'Các tác vụ chưa được lưu. Bạn chắc chắn muốn rời khỏi trang ngay bây giờ?',
		navigation_blocked_message: 'Dừng đọc EPC ngay bây giờ ?',
		stock_out_submission_caution:
			'Vui lòng kiểm tra kỹ thông tin trước khi xác nhận xuất kho. Sau khi xác nhận, bạn không thể thay đổi thông tin này.',
		too_many_mono: 'Có nhiều hơn 3 chỉ lệnh được quét. Hãy kiểm tra lại.'
	},
	counter_box: {
		caption: 'Dữ liệu EPC được truyền liên tục từ máy chủ khi kết nối được thiết lập.',
		label: 'Số EPC đã quét'
	},
	description: {
		add_outbound_size: 'Thêm size và số lượng để tiến hành xuất tách đơn.',
		archived_restoration: 'Khôi phục dữ liệu đã lưu trữ. Chỉ sử dụng khi cần thiết.',
		container_condition_assessment: 'Vui lòng đánh giá tình trạng container dưới đây (nếu có)',
		container_number_field:
			'Định dạng mã container BIC. Bỏ qua trường này trong trường hợp không có số container hiện tại.',
		create_truckload_delivery: 'Tạo mới thông tin đóng container xuất hàng khỏi nhà máy',
		daily_inbound_report: 'Theo dõi và quản lý tiến độ nhập hàng kho thành phẩm hàng ngày',
		daily_outbound_report: 'Theo dõi và quản lý tiến độ xuất hàng kho thành phẩm hàng ngày',
		defective_goods_inventory_report: 'Quản lý và theo dõi tồn kho hàng loại 2',
		defective_goods_inbound_report: 'Theo dõi và quản lý nhập hàng giày loại 2 hàng ngày',
		defective_goods_outbound_report: 'Theo dõi và quản lý xuất hàng giày loại 2 hàng ngày',
		duplicate_po_added: 'Không được thêm trùng đơn hàng, số lượng xuất không được vượt quá tổng số lượng đặt đơn.',
		exchange_all: 'Bạn có thể hoán đổi toàn bộ EPC thuộc mã thành phẩm kích cỡ đã chọn',
		exchange_epc_dialog_desc: 'Cho phép người dùng thay thế hoặc cập nhật tem EPC hiện tại sang chỉ lệnh mới.',
		exchange_qty: 'Số lượng sản phẩm được hoán đổi cho đơn hàng thực tế',
		inoutbound_form_note: 'Dừng thiết bị RFID và ngắt kết nối trước khi thao tác nhập/xuất',
		list_of_already_scanned_epcs: 'Danh sách các EPC đã quét nhập kho trước đây.',
		license_plate_field:
			'Biển số xe tương ứng với số container. Cũng bỏ qua việc nhập biển số xe nếu không biết số container.',
		monthly_inventory_report: 'Quản lý và theo dõi tồn kho hàng kho thành phẩm hàng tháng',
		no_added_size: 'Chưa có size nào được thêm',
		no_dispatch_order_item_added: 'Chưa có mục đơn hàng nào được thêm',
		no_dispatch_order_item_added_caption: 'Vui lòng thêm ít nhất một đơn hàng và số lượng xuất để tiếp tục.',
		no_exchangable_order: 'Chỉ những tem có cùng mã thành phẩm và size mới có thể đổi.',
		inventory_estimation: 'Ước tính mức tồn kho dựa trên tiến độ sản xuất và xuất hàng hiện tại',
		inbound_directive: 'Chỉ thị nhập kho',
		outbound_estimation: 'Số lượng đơn hàng xuất dự kiến',
		order_size_detail:
			'Xem thông tin chi tiết số lượng của từng size theo chỉ lệnh sản xuất. Bạn có thể bù tem nếu cần thiết.',
		order_sizing_list: 'Bảng dưới đây biểu thị danh sách chi tiết số lượng của từng Size theo chỉ lệnh',
		inoutbound_table_caption: 'Bảng trên thống kê dữ liệu các chi tiết các tem đã quét',
		inoutbound_history_not_found:
			'Không tìm thấy lịch sử nhập/xuất kho cho đơn hàng này. Vui lòng kiểm tra lại mã đơn hàng bạn đã nhập.',
		po_outbound: 'Dữ liệu xuất kho các tem đã quét sẽ được tính theo đơn hàng này.',
		select_readable_database:
			'Chọn kết nối database để đọc dữ liệu. Bạn có thể thay đổi khi không có kết nối nào hoặc kết nối hiện tại đã ngắt',
		select_writable_database:
			'Chọn kết nối database để lưu dữ liệu nhập/xuất kho. Bỏ qua nếu chỉ lệnh chỉ định được sản xuất tại nhà máy hiện tại.',
		select_order: 'Chọn chỉ lệnh sản xuất để xem dữ liệu EPC đã quét được và thao tác nhập hoặc xuất kho',
		select_rfid_process: 'Chọn quy trình sản xuất để quét tem tương ứng với các bộ phận đang nhiệm',
		skip_select_tenant: 'Bỏ qua nếu chỉ lệnh chỉ định được sản xuất tại nhà máy hiện tại.',
		transferred_order: 'Chỉ lệnh thực cần hoán đổi',
		transfer_order_datalist: 'Chọn dữ liệu từ bảng dưới để thêm đơn chuyển kho mới',
		transfer_order_list: 'Theo dõi và quản lý các đơn chuyển kho',
		inbound_history_lookup:
			'Kiểm tra lịch sử nhập hàng, thông tin lệnh sản xuất và số lượng nhập chi tiết từng ngày.',
		inoutbound_history_lookup: 'Theo dõi số lượng nhập/xuất và lịch sử giao dịch theo từng đơn hàng.',
		inventory_by_size: 'Tồn kho theo kích cỡ',
		inventory_by_size_desc: 'Thông tin số lượng sản phẩm theo từng cỡ của sản phẩm',
		inventory_audit: 'Kiểm kê hàng nhập kho',
		inventory_audit_desc: 'Danh sách chỉ lệnh đã nhập kho dựa trên từng loại sản phẩm',
		outbound_history_lookup: 'Xem chi tiết lịch sử xuất kho, thông tin đơn hàng và số lượng xuất từng ngày.',
		outbound_order_estimation: 'Đánh giá tiến độ xuất hàng',
		outbound_order_estimation_desc: 'Đánh giá tiến độ xuất hàng của từng PO dựa trên số lượng tem đã quét.',
		update_truckload_delivery: 'Cập nhật thông tin đóng container xuất hàng khỏi nhà máy',
		size_qty_caption: 'Tổng quan số lượng theo từng cỡ',
		empty_defect_item_caption: 'Chưa có dữ liệu. Hãy thêm bản ghi mới với biểu mẫu bên.',
		defective_epc_caption: 'Hãy chọn ô nhập này và quét mã EPC của hàng lỗi. Mã EPC phải đủ 24 ký tự.',
		truckload_delivery: 'Quản lý thông tin đóng container xuất hàng khỏi nhà máy',
		request_change_dispatch_order_info:
			'Phát hiện sự sai lệch trong thông tin xuất hàng; XNK và nhân viên kho cần cập nhật lại dữ liệu.',
		confirm_dispatch_order_info:
			'Xác nhận thông tin xuất hàng là chính xác và phê duyệt cho lô hàng rời khỏi nhà máy.',
		update_dispatch_order_signature_info: 'Cập nhật chữ ký xác nhận thông tin xuất hàng'
	},
	errors: {
		wrong_stamp: 'Dán sai tem'
	},
	inoutbound_actions: {
		eliminate: 'Chặt bỏ',
		normal_export: 'Xuất kho bình thường',
		normal_import: 'Nhập kho bình thường',
		recycle: 'Tái chế',
		return_for_repair: 'Hàng trả về để sửa chữa',
		sell: 'Bán',
		giveaway: 'Tặng quà',
		scrap: 'Báo phế',
		transfer_inbound: 'Điều động nhập kho',
		transfer_outbound: 'Điều động xuất kho'
	},
	labels: {
		delete_all: 'Xóa tất cả',
		delete_and_unscannable: 'Xóa và không quét lại',
		exchange_all: 'Hoán đổi tất cả',
		inoutbound_method: 'Phương thức nhập/xuất',
		io_archive_warehouse: 'Kho lưu trữ',
		io_reason: 'Lý do nhập/xuất',
		io_storage_location: 'Vị trí lưu kho',
		order_information: 'Thông tin đơn hàng',
		transfer_information: 'Thông tin chuyển kho',
		security_confirmation: 'Xác nhận của bảo vệ',
		signature: 'Chữ ký'
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
	placeholders: {
		enter_storage_location: 'Nhập vị trí lưu kho ...',
		outbound_purpose: 'Chọn lý do xuất kho ...',
		max_qty: 'Tối đa {{qty}} (prs)',
		select_rfid_device: 'Chọn thiết bị RFID'
	},
	rfid_process: {
		cutting_inbound: 'Quét tem pha cắt',
		production_management_inbound: 'Quét tem kho QLSX',
		shaping_inbound: 'Quét tem định hình'
	},
	scanner_setting: {
		adjust_setting_description: 'Điều chỉnh cài đặt RFID Playground',
		cron_job: 'Trạng thái quét',
		data_restoration: 'Khôi phục dữ liệu',
		restore_deleted_epcs: 'Khôi phục các EPC đã xóa',
		data_restoration_note: 'Khôi phục lại các EPCs đã xóa và lưu lại',
		synchronization: 'Đồng bộ',
		developer_mode: 'Chế độ phát triển',
		developer_mode_note: 'Bật chế độ phát triển để sử dụng các tính năng nâng cao hơn',
		fetch_oder_data_note: 'Cho phép bạn tải các dữ liệu EPC cũ hơn chưa thực hiện thao tác nhập/xuất',
		fetch_older_data: 'Lấy dữ liệu cũ',
		server_connection: 'Kết nối máy chủ',
		latency: 'Độ trễ',
		network_status: 'Trạng thái kết nối',
		decker_data_synchronization: 'Đồng bộ dữ liệu Deckers',
		decker_data_synchronization_description:
			'Chọn nhà máy nơi các chỉ lệnh không có dữ liệu được sản xuất để tiến hành đồng bộ',
		toggle_fullscreen: 'Chế độ toàn màn hình',
		toggle_fullscreen_note: 'Sử dụng chế độ toàn màn hình để có góc nhìn rộng hơn',
		transferred_data: 'Dữ liệu đã chuyển'
	},
	titles: {
		archived_restoration: 'Khôi phục dữ liệu',
		defective_goods_inventory_report: 'Báo biểu tồn kho hàng loại 2',
		combination_history: 'Lịch sử phối tem',
		container_condition_assessment: 'Đánh giá tình trạng container',
		create_truckload_delivery: 'Tạo mới thông tin đóng container',
		daily_inbound_report: 'Báo cáo nhập kho hàng ngày',
		daily_outbound_report: 'Báo cáo xuất kho hàng ngày',
		file_daily_inbound_report: 'Báo biểu nhập kho {{factory}} - {{date}}',
		file_daily_outbound_report: 'Báo biểu xuất kho {{factory}} - {{date}}',
		file_daily_defective_goods_inbound_report: 'Báo biểu nhập kho hàng loại 2 {{factory}} - {{date}}',
		file_daily_defective_goods_outbound_report: 'Báo biểu xuất kho hàng loại 2 {{factory}} - {{date}}',
		file_defective_goods_inventory_report: 'Tồn kho hàng loại 2 - {{factory}}',
		file_shaping_department_productivity_report: 'Báo biểu sản lượng thành hình {{factory}} - {{date}}',
		file_monthly_inventory_report: 'Báo biểu tồn kho {{factory}} - {{month}}',
		file_production_inventory_summary: 'Tổng Quan Tồn Kho Thành Phẩm - {{factory}}',
		file_truckload_delivery_report: 'Báo cáo xuất hàng KTP theo xe - {{factory}}',
		exchange_epc: 'Hoán đổi EPC',
		exchange_order: 'Hoán đổi đơn hàng',
		inbound_history: 'Lịch sử nhập kho',
		inoutbound_history_lookup: 'Tìm kiếm lịch sử nhập/xuất kho',
		monthly_inventory_report: 'Báo biểu tồn kho hàng tháng',
		outbound_history: 'Lịch sử xuất kho',
		order_sizing_list: 'Danh sách Size theo đơn',
		production_inventory_summary: 'Tổng quan tồn kho thành phẩm',
		transfer_order_datalist: 'Dữ liệu đơn chuyển kho',
		transfer_order_list: 'Danh sách đơn chuyển kho',
		update_truckload_delivery: 'Cập nhật thông tin đóng container'
	},
	shoes_category: {
		b_grade: 'Loại B',
		c_grade: 'Loại C',
		research_development: 'Hàng mẫu'
	},
	shoes_source: {
		[DefectiveGoodsSource.FINAL_INSPECTION]: 'Kiểm tra thành phẩm',
		[DefectiveGoodsSource.ASSEMBLY]: 'Thành hình',
		[DefectiveGoodsSource.REPACKING_INSPECTION]: 'Kiểm tra đóng gói',
		[DefectiveGoodsSource.OTHER]: 'Khác'
	}
}
