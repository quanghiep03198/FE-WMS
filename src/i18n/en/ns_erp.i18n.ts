export default {
	descriptions: {
		centralized_po: 'Multiple production orders are consolidated into a single purchase order.',
		decentralized_po: 'Multiple production orders are distributed into different purchase orders.',
		no_purchase_order_found:
			'The purchase order may not exist or has no associated size run data or already finished.',
		order_detail: 'View order details including product information, quantities at a glance.',
		provide_po_info: 'Provide order, product, and shipment details in seconds.',
		purchase_order_seeking: 'Seeking information and quantity of processing purchase orders by PO code.',
		quick_po_search: 'Quickly search for processing purchase orders by entering PO code.',
		shipping_detail: 'Access common shipping information for each order.',
		update_dispatch_order_signature: 'Update dispatch order signature information.'
	},
	fields: {
		accumulated_qty: 'Accumulated quantity',
		actual_avg_weight: 'Actual average weight (kg)',
		actual_departure_time: 'Actual departure time',
		actual_instock_qty: 'Actual instock quantity',
		actual_inventory_qty: 'Actual inventory quantity',
		actual_missing_qty: 'Actual missing quantity',
		actual_outstock_qty: 'Actual outstock quantity',
		actual_weight: 'Actual weight (kg)',
		assembly_dept_name: 'Assembly department name',
		assembly_line: 'Assembly line', // Shaping Department Productivity
		assembly_line_code: 'Assembly department code',
		brand_name: 'Customer branch name',
		category: 'Category', //: Số đôi nhập kho
		centralized_po: 'Centralized PO',
		color_sn: 'Product color', // Recalled Quantity
		combination_strategy: 'Combination type',
		container_number: 'Container number', //: Phân loại hàng hóa
		container_order_code: 'Container Order Code',
		container_sealing_time: 'Container sealing time',
		conversion_rate: 'Conversion rate', //: Đặt đơn của khách
		cust_shoes_style: 'Customer shoes style',
		customer_branch_id: 'Customer branch ID',
		customer_order: 'Customer order code',
		daily_inbound_qty: 'Daily inbound quantity',
		daily_outbound_qty: 'Daily outbound quantity',
		daily_productivity: 'Daily productivity',
		decentralized_po: 'Decentralized PO',
		defective_description: 'Defect description',
		defective_location: 'Defect location',
		dept_name: 'Department',
		dispatch_order: 'Dispatch order',
		employee_name: "Employee's name",
		export_num: 'Qty. of goods shipped', //: Số đã xuất kho
		factory_code_produce: 'Producing factory',
		factory_departure_time: 'Factory departure time',
		factory_entrance_time: 'Factory entrance time',
		factory_shoes_style: 'Factory shoes style',
		final_inventory_qty: 'Final inventory',
		ie_signature: 'Import-Export department signature',
		inbound_date: 'Inbound date',
		inbound_qty: 'Inbound quantity',
		inspected_qty: 'Inspected quantity',
		inventory_qty_by_order: 'Actual instock quantity',
		kg_noend: 'Ending Box Number',
		kg_nostart: 'Starting Box Number',
		last_inbound_time: 'Last inbound time', // Last Inbound Time
		last_outbound_time: 'Last Outbound Time', // Last Outbound Time
		license_plate: 'License plate',
		mat_code: 'Finished production code',
		missing_qty: 'Missing quantity',
		mo_no: 'Manufacturing order',
		mo_no_actual: 'Actual manufacturing order',
		mo_noseq: 'Manufacturing sub-order',
		mo_qty: 'Manufacturing quantity',
		mo_size_qty: 'Quantity by size',
		moist_container: 'Moist container',
		no_crates_in_stock: 'No. crates in stock', //: Số thùng nhập kho
		no_pair_in_stock: 'No. pairs in stock',
		or_custpo: 'Customer order code',
		or_custpoone: 'Customer purchase code', //：Mã đặt đơn
		or_no: 'Sub-manufacturing order',
		or_qtyperpacking: 'Total Quantity per Box',
		or_totalqty: 'Total quantity',
		order_qty: 'Order quantity',
		outbound_date: 'Outbound date',
		outbound_purpose: 'Outbound purpose',
		outbound_qty: 'Outbound quantity',
		packaging_code: 'Packaging number',
		packing_standard: 'Packing standard',
		po: 'Purchase order',
		po_size_qty: 'Purchase order quantity by size',
		prod_color: 'Product color',
		progress: 'Progress',
		punctured_container: 'Punctured container',
		recalled_qty: 'Recalled Quantity',
		required_date: 'Required date',
		returned_qty: 'Returned quantity',
		seal_number: 'Seal number',
		security_guard_signature: 'Security guard signature {{number}}', //: Giày cấp B
		sewing_line: 'Sewing line',
		shaping_dept_productivity: 'Shaping department productivity',
		ship_order: 'Shipping order number',
		shipment_confirm_date: 'Shipment confirm date',
		shipping_destination: 'Shipping destination',
		shipping_id: 'Shipping ID',
		shipping_method: 'Shipping type',
		shoe_source: 'Shoes source', //: Ngày xác nhận xuất hàng
		shoes_type_b: 'Shoes type B',
		smelling_container: 'Smelling container',
		sno_car_number: 'Container number',
		sno_date: 'Order date',
		sno_no: 'Order code',
		sno_qty: 'Box Quantity',
		sno_qty_notyet: 'Missing quantity',
		sno_sealnumber: 'Seal number',
		sno_size: 'Size',
		sno_total: 'Total',
		sno_total_boxes: 'Total boxes',
		sno_type: 'Type',
		standard_weight: 'Standard weight (kg)',
		status_approve: 'Approval status',
		target_box_qty: 'Target box quantity',
		target_item_qty: 'Target item quantity',
		total_init_qty: 'Initial stock quantity',
		total_qty_by_size: 'Total by size',
		trans_num: 'Number of Boxes Issued',
		transfer_order_code: 'Transfer order code',
		uninspected_qty: 'Uninspected quantity',
		unweighed_box_qty: 'Unweighed box quantity',
		warehouse_officer_signature: 'Warehouse officer signature',
		weighed_box_qty: 'Weighed box quantity'
	},
	labels: {
		defective_description: 'Defect description',

		defective_location: 'Defect location'
	},
	rfid_match_craft_form: {
		description: "Craft EPC's information that does not exist in the system.",

		title: 'Update EPC information'
	},

	shoes_parts: {
		bottom: 'Bottom',

		upper: 'Upper'
	},

	titles: {
		order_detail: 'Order Detail',
		product_info: 'Product Information',
		purchase_order_seeking: 'Seeking purchase order information',
		quick_po_search: 'Quick PO Search',
		report_type: 'Report Type',
		shipping_detail: 'Shipping Detail'
	}
}
