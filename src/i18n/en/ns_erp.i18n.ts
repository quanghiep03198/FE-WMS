export default {
	fields: {
		mo_no: 'Manufacturing order',
		mo_no_actual: 'Actual manufacturing order',
		or_no: 'Sub-manufacturing order',
		or_custpo: 'Customer order code',
		mat_code: 'Finished production code',
		transfer_order_code: 'Transfer order code',
		// I/O production
		status_approve: 'Approval status',
		sno_no: 'Order code',
		sno_date: 'Order date',
		sno_sealnumber: 'Seal number',
		sno_container: 'Container number',
		sno_total_boxes: 'Total boxes',
		packaging_code: 'Packaging number',
		sno_car_number: 'Container number',
		ship_order: 'Shipping order number',
		dept_name: 'Department',
		employee_name: 'Employee',
		sno_total: 'Total',
		sno_size: 'Size',
		sno_type: 'Type',
		prod_color: 'Product color',
		// product inspection details
		container_order_code: 'Container Order Code',
		order_qty: 'Order quantity',
		uninspected_qty: 'Uninspected quantity',
		inspected_qty: 'Inspected quantity',
		returned_qty: 'Returned quantity',
		conversion_rate: 'Conversion rate',
		required_date: 'Required date',
		//
		trans_num: 'Number of Boxes Issued',
		or_qtyperpacking: 'Total Quantity per Box',
		sno_qty: 'Box Quantity',
		kg_nostart: 'Starting Box Number',
		kg_noend: 'Ending Box Number',
		shoestyle_codefactory: 'Shoes style code',
		brand_name: 'Customer branch name',
		customer_branch_id: 'Customer branch ID',
		shaping_dept_code: 'Shaping department code',
		shaping_dept_name: 'Shaping department name',
		or_totalqty: 'Total quantity',
		sno_qty_notyet: 'Missing quantity',
		// or_no: 'Sub-order code', //: Chỉ lệnh con
		or_custpoone: 'Customer purchase code', //：Mã đặt đơn
		customer_order: 'Customer order code', //: Đặt đơn của khách
		shipment_confirm_date: 'Shipment confirm date', //: Ngày xác nhận xuất hàng
		no_crates_in_stock: 'No. crates in stock', //: Số thùng nhập kho
		no_pair_in_stock: 'No. pairs in stock', //: Số đôi nhập kho
		export_num: 'Qty. of goods shipped', //: Số đã xuất kho
		shoes_type_b: 'Shoes type B', //: Giày cấp B
		shipping_destination: 'Shipping destination'
	},
	inventory_list_type: {
		finished_goods_dispatch: 'Finished Product Delivery Order',
		finished_goods_receipt: 'Finished Product Warehouse Import Order',
		outbound_shipment_receipt: 'Warehouse Export Transfer Order',
		inbound_shipment_receipt: 'Warehouse Import Transfer Order'
	}
}
