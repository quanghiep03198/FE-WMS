import { InventoryListType } from '@/app/(features)/_layout.warehouse-import/_constants/warehouse-import.enum'
import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Scanned EPCs',
		caption: 'EPC codes data is automatically synchronized every {{value}} seconds.'
	},
	mo_no_box: {
		caption: 'You can determine which order should be used to import/export',
		order_count: '{{ count }} order(s) found'
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
		too_many_mono: 'There are more than 3 commands scanned. Please check again.',
		navigation_blocked_message: 'Cancel scanning EPCs anyway ?',
		navigation_blocked_caption: 'Unsaved tasks. Are you sure you want to leave the page right now?',
		confirm_delete_all_mono: {
			title: 'Bạn chắc chắn muốn xóa chỉ lệnh này ?',
			description: 'Nếu bạn xóa hết, thao tác quét epc sẽ phải thực hiện lại'
		}
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
	inventory_list_type: {
		[InventoryListType.PRODUCTION_WAREHOUSE_EXPORT]: 'Finished Product Delivery Order',
		[InventoryListType.PRODUCTION_WAREHOUSE_IMPORT]: 'Finished Product Warehouse Import Order',
		[InventoryListType.WAREHOUSE_EXPORT_TRANSFER]: 'Warehouse Export Transfer Order',
		[InventoryListType.WAREHOUSE_IMPORT_TRANSFER]: 'Warehouse Import Transfer Order'
	},
	titles: {
		transfer_order_list: 'Transfer orders list',
		transfer_order_datalist: 'Transfer order datalist',
		order_sizing_list: 'Order sizing list'
	},
	description: {
		transfer_order_list: 'Following and managing transfer orders',
		transfer_order_datalist: 'Pick the data from the table below to add new transfer orders',
		order_sizing_list: 'Table below shows the sizing information of the scanned orders'
	}
}
