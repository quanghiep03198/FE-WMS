import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Scanned EPCs',
		caption: 'EPC codes data is automatically synchronized every {{value}} seconds.'
	},
	action_types: {
		warehouse_input: 'Warehouse input',
		warehouse_output: 'Warehouse output'
	},
	labels: {
		io_reason: 'Import/Export reason',
		io_archive_warehouse: 'Archived warehouse',
		io_storage_location: 'Storage location',
		order_information: 'Order information',
		transfer_information: 'Transfer information'
	},
	inoutbound_actions: {
		normal_import: 'Normally import',
		normal_export: 'Normally export',
		scrap: 'Scrap',
		transfer_outbound: 'Transfer outbound',
		transfer_inbound: 'Transfer inbound',
		recycling: 'Recycling',
		return_for_repair: 'Return for Repair'
	},
	notification: {
		conflict_mono: 'There are up to 2 monos being read at this time, please check again!',
		navigation_blocked_message: 'Dừng đọc EPC ngay bây giờ ?',
		navigation_blocked_caption: 'Các tác vụ chưa được lưu. Bạn chắc chắn muốn rời khỏi trang ngay bây giờ?'
	},
	fields: {
		mo_no: 'Order',
		or_no: 'Order code',
		or_custpo: 'Customer order code',
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
		kg_noend: 'Ending Box Number'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.CANCELLED]: 'Cancelled',
		[OrderStatus.REAPPROVED]: 'Reapproved'
	},
	titles: {
		transfer_order_list: 'Transfer orders list',
		transfer_order_datalist: 'Transfer order datalist'
	},
	description: {
		transfer_order_list: 'Following and managing transfer orders',
		transfer_order_datalist: 'Pick the data from the table below to add new transfer orders'
	}
}
