export default {
	counter_box: {
		label: 'Số lượng EPC đã quét',
		caption: 'Dữ liệu đọc EPC tự động đồng bộ sau mỗi {{value}} giây.'
	},
	action_types: {
		warehouse_input: 'Nhập kho',
		warehouse_output: 'Xuất kho'
	},
	labels: {
		imp_exp_reason: 'Lý do nhập/xuất',
		imp_archive_warehouse: 'Kho lưu trữ',
		imp_location: 'Vị trí lưu kho'
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
		conflict_mono: 'Đã có lỗi xảy ra ! Có nhiều hơn 1 chỉ lệnh được quét. Hãy kiểm tra lại.'
	}
}
