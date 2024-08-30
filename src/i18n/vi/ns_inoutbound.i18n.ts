import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Số lượng EPC đã quét',
		caption: 'Dữ liệu đọc EPC tự động đồng bộ sau mỗi {{value}} giây.'
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
		order_sizing_list: 'Bảng dưới đây biểu thị danh sách chi tiết số lượng của từng Size theo chỉ lệnh'
	}
}
