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

	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.CANCELLED]: 'Cancelled',
		[OrderStatus.REAPPROVED]: 'Reapproved'
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
