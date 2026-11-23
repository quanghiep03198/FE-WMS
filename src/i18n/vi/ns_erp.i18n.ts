export default {
	descriptions: {
		centralized_po: 'Nhiều lệnh sản xuất được gom chung vào một PO duy nhất.',
		decentralized_po: 'Nhiều lệnh sản xuất được phân vào nhiều PO khác nhau.',
		no_purchase_order_found:
			'Đơn đặt hàng có thể không tồn tại hoặc không có dữ liệu chạy size liên quan hoặc đã hoàn tất.',
		order_detail: 'Xem chi tiết đơn hàng bao gồm thông tin sản phẩm, số lượng một cách nhanh chóng.',
		provide_po_info: 'Truy cập nhanh mọi thông tin liên quan đến đơn đặt hàng của khách hàng.',

		purchase_order_seeking: 'Tìm kiếm thông tin, số lượng đơn đặt hàng theo mã PO.',
		quick_po_search: 'Tìm kiếm nhanh đơn đặt hàng đang xử lý bằng cách nhập mã PO.',
		shipping_detail: 'Truy cập thông tin vận chuyển chung cho từng đơn hàng.'
	},
	fields: {
		accumulated_qty: 'Số lượng tích lũy',
		actual_avg_weight: 'Trọng lượng TB thực tế (kg)',
		actual_departure_time: 'TG xuất xưởng thực tế',
		actual_instock_qty: 'Số lượng nhập thực tế',
		actual_inventory_qty: 'Số lượng kiểm kê',
		actual_missing_qty: 'Số lượng thiếu thực tế',
		actual_outstock_qty: 'Số lượng xuất thực tế',
		actual_weight: 'Trọng lượng thực tế (kg)',
		assembly_dept_name: 'Chuyền thành hình',
		assembly_line: 'Chuyền thành hình',
		assembly_line_code: 'Mã chuyền thành hình',
		brand_name: 'Nhãn hàng',
		category: 'Phân loại',
		centralized_po: 'PO không phân tách',
		color_sn: 'Màu sắc',
		combination_strategy: 'Kiểu phối',
		container_number: 'Mã container',
		container_order_code: 'Mã Đơn Xuất Công',
		container_sealing_time: 'TG niêm phong container', // Container Order Code
		conversion_rate: 'Tỷ Lệ Chuyển Đổi',
		cust_shoes_style: 'Hình thể khách', // Conversion Rate
		customer_branch_id: 'ID nhã hiệu khách hàng',
		customer_order: 'Đặt đơn của khách',
		daily_inbound_qty: 'Số lượng nhập trong ngày',
		daily_outbound_qty: 'Số lượng xuất trong ngày',
		daily_productivity: 'Sản lượng ngày', // Returned Quantity
		decentralized_po: 'PO phân tách',
		defective_description: 'Mô tả lỗi',
		defective_location: 'Vị trí lỗi',
		dept_name: 'Bộ phận cập nhật',
		dispatch_order: 'Mã đơn xuất xưởng',
		employee_name: 'Nhân viên tạo đơn',
		export_num: 'Số đã xuất kho',
		factory_code_produce: 'Nhà máy sản xuất',
		factory_departure_time: 'TG xuất xưởng',
		factory_entrance_time: 'TG vào xưởng',
		factory_shoes_style: 'Hình thể xưởng',
		final_inventory_qty: 'Tồn kho cuối kỳ',
		ie_signature: 'Chữ ký XNK',
		inbound_date: 'Ngày Nhập Kho', // Inbound Date
		inbound_qty: 'Số Lượng Nhập Kho', // Inbound Quantity
		inspected_qty: 'Số Lượng Đã Kiểm Tra', // Inspected Quantity
		inventory_qty_by_order: 'Tồn kho theo đơn',
		kg_noend: 'Thứ tự thùng cuối',
		kg_nostart: 'Thứ tự thùng đầu',
		last_inbound_time: 'Thời gian nhập kho gần nhất', // Last Inbound Time
		last_outbound_time: 'Thời gian xuất kho gần nhất', // Last Outbound Time
		license_plate: 'Biển số xe',
		mat_code: 'Mã thành phẩm',
		missing_qty: 'Số lượng còn thiếu',
		mo_no: 'Chỉ lệnh',
		mo_no_actual: 'Chỉ lệnh thực',
		mo_noseq: 'Tiểu chỉ lệnh',
		mo_qty: 'Số lượng đặt đơn',
		mo_size_qty: 'Số lượng theo size',
		moist_container: 'Container bị ẩm',
		no_crates_in_stock: 'Số thùng nhập kho',
		no_pair_in_stock: 'Số đôi nhập kho',
		or_custpo: 'Mã đơn đặt hàng của khách',
		or_custpoone: 'Mã đặt đơn',
		or_no: 'Mã đơn hàng',
		or_qtyperpacking: 'Tổng số lượng đóng thùng',
		or_totalqty: 'Tổng số lượng đặt hàng',
		order_qty: 'Số lượng đặt hàng', // Order Quantity
		outbound_date: 'Ngày Xuất Kho',
		outbound_purpose: 'Mục đích xuất kho', // Outbound Date
		outbound_qty: 'Số lượng xuất kho',
		packaging_code: 'Mã đóng thùng',
		packing_standard: 'Quy cách đóng thùng',
		po: 'Mã đơn hàng',
		po_size_qty: 'Số lượng đặt đơn theo cỡ',
		prod_color: 'Màu sắc',
		progress: 'Tiến độ',
		punctured_container: 'Container bị thủng',
		recalled_qty: 'Số Lượng Đã Thu Hồi', // Recalled Quantity
		required_date: 'Ngày Yêu Cầu', // Required Date
		returned_qty: 'Số Lượng Đã Trả Hàng',
		seal_number: 'Số chì',
		security_guard_signature: 'Chữ ký Bảo Vệ {{number}}',
		sewing_line: 'Chuyền may',
		shaping_dept_productivity: 'Sản lượng thành hình',
		ship_order: 'Mã đóng hàng',
		shipment_confirm_date: 'Ngày xác nhận xuất hàng',
		shipping_destination: 'Địa điểm giao hàng',
		shipping_id: 'Mã vận chuyển',
		shipping_method: 'Phương thức vận chuyển', // Shaping Department Productivity
		shoe_source: 'Nguồn giày',
		shoes_type_b: 'Giày loại B',
		smelling_container: 'Container có mùi',
		sno_car_number: 'Số xe container',
		sno_date: 'Ngày tạo đơn',
		sno_no: 'Mã đơn hàng nhập/xuất',
		sno_qty: 'Số lượng đóng thùng',
		sno_qty_notyet: 'Số lượng còn thiếu',
		sno_sealnumber: 'Mã vạch niêm phong container',
		sno_size: 'Kích cỡ',
		sno_total: 'Tổng số đôi',
		sno_total_boxes: 'Số lượng đóng thùng',
		sno_type: 'Loại',
		standard_weight: 'Trọng lượng tiêu chuẩn (kg)',
		status_approve: 'Trạng thái duyệt đơn',
		target_box_qty: 'Số thùng cần cân',
		target_item_qty: 'Số đôi cần cân',
		total_init_qty: 'Số lượng nhập kỳ đầu',
		total_qty_by_size: 'Tổng theo size',
		trans_num: 'Lượng thùng đã phát',
		transfer_order_code: 'Mã đơn chuyển giao',
		uninspected_qty: 'Số Lượng Chưa Kiểm Tra',
		unweighed_box_qty: 'Số thùng chưa cân',
		warehouse_officer_signature: 'Chữ ký KTP',
		weighed_box_qty: 'Số thùng đã cân'
	},
	rfid_match_craft_form: {
		description: 'Cập nhật thông tin cho các EPC không có đơn hàng trên hệ thống',

		title: 'Cập nhật thông tin EPC'
	},
	shoes_parts: {
		bottom: 'Đế giày',

		upper: 'Mũ giày'
	},

	titles: {
		order_detail: 'Chi tiết đơn hàng',
		product_info: 'Thông tin sản phẩm',
		purchase_order_seeking: 'Tra cứu đơn đặt hàng',
		quick_po_search: 'Tìm kiếm nhanh PO',
		report_type: 'Loại báo cáo',
		shipping_detail: 'Chi tiết vận chuyển'
	}
}
