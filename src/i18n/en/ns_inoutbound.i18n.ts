/* eslint-disable no-useless-escape */
import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: 'Scanned EPCs',
		caption: 'Data is streamed continuously from server when connection is established.'
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
		transfer_information: 'Transfer information',
		exchange_all: 'Exchange all'
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
		},
		exchange_order_caution:
			'The action of swapping production orders cannot be undone. Please make sure to confirm your changes before proceeding.',
		invalid_epc_deteted:
			'Invalid EPC detected. Please contact to shaping department for this issue, then move them to recycle'
	},

	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.CANCELLED]: 'Cancelled',
		[OrderStatus.REAPPROVED]: 'Reapproved'
	},
	rfid_process: {
		production_management_inbound: 'P.M Inbound',
		cutting_inbound: 'Cutting Inbound',
		shaping_inbound: 'Shaping Inbound'
	},
	titles: {
		transfer_order_list: 'Transfer orders list',
		transfer_order_datalist: 'Transfer order datalist',
		order_sizing_list: 'Order sizing list',
		exchange_epc: 'Exchange EPC',
		exchange_order: 'Exchange manufacturing order'
	},
	description: {
		transfer_order_list: 'Following and managing transfer orders',
		transfer_order_datalist: 'Pick the data from the table below to add new transfer orders',
		order_sizing_list: 'Table below shows the sizing information of the scanned orders',
		inoutbound_form_note: 'Disconnect before updating stock moves',
		select_order:
			'Select the production order to view its scanned EPC data and perform warehouse inbound or outbound operations.',
		select_database:
			'Select a database connection to read the data. You can change it when there is no connection or the current connection has been interrupted.',
		order_size_detail:
			'View detailed quantity information for each size according to the production order. You can exchange EPC if necessary.',
		no_exchangable_order: 'Only items with the same production code and size number can be exchanged.',
		exchange_epc_dialog_desc:
			'Allows users to replace or update EPC tags on a product with a new manufacturing order.',
		transferred_order: 'The actual order code to be exchanged',
		exchange_qty: 'Number of exchanged items for the actual order',
		exchange_all: 'You can exchange the whole EPC belongs to the selected size'
	},
	scanner_setting: {
		network_status: 'Network status',
		internet_access: 'Internet access',
		latency: 'Latency',
		cron_job: 'Job status',
		transferred_data: 'Transferred data',
		polling_duration: 'Polling duration',
		polling_duration_note: 'Choose polling duration before scanning',
		polling_duration_description:
			'Controls polling duration: lower value means faster polling however it can cause higher traffic for server',
		fetch_older_data: 'Fetch older data',
		fetch_oder_data_note: "Allow you to scan EPC that's not imported/exported from the previous days",
		toggle_fullscreen: 'Toggle full screen',
		toggle_fullscreen_note: 'Use full screen mode to have larger view',
		preserve_log: 'Preserve log',
		preserve_log_note: 'Do not clear log on reset',
		developer_mode: 'Developer mode',
		developer_mode_note: 'Enabling developer mode for more advanced features',
		adjust_setting_description: 'Adjust RFID Playground settings'
	}
}
