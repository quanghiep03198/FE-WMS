import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Số lượng EPC đã quét',
		caption: 'Dữ liệu đọc EPC tự động đồng bộ sau mỗi {{value}} giây.'
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
	fields: {
		mo_no: 'Chỉ lệnh',
		or_no: 'Mã đơn hàng',
		or_custpo: 'Mã đơn đặt hàng của khách',
		transfer_order_code: 'Mã đơn chuyển giao',
		// I/O production
		status_approve: 'Trạng thái duyệt đơn',
		sno_no: 'Mã đơn hàng nhập/xuất',
		sno_date: 'Ngày tạo đơn',
		sno_sealnumber: 'Mã vạch niêm phong container',
		sno_container: 'Mã container',
		sno_total_boxes: 'Số lượng đóng thùng',
		packaging_code: 'Mã đóng thùng',
		sno_car_number: 'Số xe container',
		ship_order: 'Mã đóng hàng',
		dept_name: 'Bộ phận cập nhật',
		employee_name: 'Nhân viên tạo đơn',
		sno_total: 'Tổng số đôi',
		sno_size: 'Kích cỡ',
		sno_type: 'Loại',
		// product inspection details
		container_order_code: 'Mã Đơn Xuất Công', // Container Order Code
		order_qty: 'Số Lượng Đơn Đặt Hàng', // Order Quantity
		uninspected_qty: 'Số Lượng Chưa Kiểm Tra', // Uninspected Quantity
		inspected_qty: 'Số Lượng Đã Kiểm Tra', // Inspected Quantity
		returned_qty: 'Số Lượng Đã Trả Hàng', // Returned Quantity
		conversion_rate: 'Tỷ Lệ Chuyển Đổi', // Conversion Rate
		required_date: 'Ngày Yêu Cầu', // Required Date
		//
		trans_num: 'Lượng thùng đã phát',
		or_qtyperpacking: 'Tổng số lượng đóng thùng',
		sno_qty: 'Số lượng đóng thùng',
		kg_nostart: 'Thứ tự thùng đầu',
		kg_noend: 'Thứ tự thùng cuối'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Chờ duyệt',
		[OrderStatus.APPROVED]: 'Đã duyệt',
		[OrderStatus.CANCELLED]: 'Đã hủy duyệt',
		[OrderStatus.REAPPROVED]: 'Duyệt lại'
	},
	titles: {
		transfer_order_list: 'Danh sách đơn chuyển kho',
		transfer_order_datalist: 'Dữ liệu đơn chuyển kho'
	},
	description: {
		transfer_order_list: 'Theo dõi và quản lý các đơn chuyển kho',
		transfer_order_datalist: 'Chọn dữ liệu từ bảng dưới để thêm đơn chuyển kho mới'
	}
}
