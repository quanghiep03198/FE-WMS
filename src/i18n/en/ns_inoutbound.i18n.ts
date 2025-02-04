import { OrderStatus } from '@/common/constants/enums'

export default {
	action_types: {
		warehouse_input: 'Warehouse input',
		warehouse_output: 'Warehouse output'
	},
	counter_box: {
		label: 'Scanned EPCs',
		caption: 'Data is streamed continuously from server when connection is established.'
	},
	description: {
		exchange_all: 'You can exchange the whole EPC belongs to the selected size',
		exchange_epc_dialog_desc:
			'Allows users to replace or update EPC tags on a product with a new manufacturing order.',
		inbound_report: 'View the scanned EPC data and perform warehouse inbound operations',
		inoutbound_form_note: 'Disconnect before updating stock moves',
		no_exchangable_order: 'Only items with the same production code and size number can be exchanged.',
		order_size_detail:
			'View detailed quantity information for each size according to the production order. You can exchange EPC if necessary.',
		order_sizing_list: 'Table below shows the sizing information of the scanned orders',
		select_database:
			'Select a database connection to read the data. You can change it when there is no connection or the current connection has been interrupted.',
		select_order:
			'Select the production order to view its scanned EPC data and perform warehouse inbound or outbound operations.',
		select_rfid_process: 'Select the process to scan the corresponding tags for the responsible departments',
		transferred_order: 'The actual order code to be exchanged',
		exchange_qty: 'Number of exchanged items for the actual order',
		transfer_order_datalist: 'Pick the data from the table below to add new transfer orders',
		transfer_order_list: 'Following and managing transfer orders'
	},
	errors: {
		wrong_stamp: 'Wrong stamp'
	},
	inoutbound_actions: {
		normal_export: 'Normally export',
		normal_import: 'Normally import',
		recycling: 'Recycling',
		return_for_repair: 'Return for Repair',
		scrap: 'Scrap',
		transfer_inbound: 'Transfer inbound',
		transfer_outbound: 'Transfer outbound'
	},
	labels: {
		delete_all: 'Delete all',
		exchange_all: 'Exchange all',
		io_archive_warehouse: 'Archived warehouse',
		io_reason: 'Import/Export reason',
		io_storage_location: 'Storage location',
		order_information: 'Order information',
		transfer_information: 'Transfer information'
	},
	mo_no_box: {
		caption: 'You can determine which order should be used to import/export',
		order_count: '{{ count }} order(s) found'
	},
	notification: {
		confirm_delete_all_mono: {
			title: 'Do you want to delete this order?',
			description: 'If you delete it, you have to rescan EPCs.'
		},
		exchange_order_caution:
			'The action of swapping production orders cannot be undone. Please make sure to confirm your changes before proceeding.',
		invalid_epc_deteted:
			'Invalid EPC detected. Please contact to shaping department for this issue, then move them to recycle',
		navigation_blocked_caption: 'Unsaved tasks. Are you sure you want to leave the page right now?',
		navigation_blocked_message: 'Cancel scanning EPCs anyway ?',
		too_many_mono: 'There are more than 3 commands scanned. Please check again.'
	},
	order_status: {
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.CANCELLED]: 'Cancelled',
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.REAPPROVED]: 'Reapproved'
	},
	rfid_process: {
		cutting_inbound: 'Cutting Inbound',
		production_management_inbound: 'P.M Inbound',
		shaping_inbound: 'Shaping Inbound'
	},
	scanner_setting: {
		adjust_setting_description: 'Adjust RFID Playground settings',
		cron_job: 'Job status',
		data_synchronization: 'Synchronization runner',
		developer_mode: 'Developer mode',
		developer_mode_note: 'Enabling developer mode for more advanced features',
		fetch_oder_data_note: "Allow you to scan EPC that's not imported/exported from the previous days",
		fetch_older_data: 'Fetch older data',
		internet_access: 'Internet access',
		latency: 'Latency',
		network_status: 'Network status',
		polling_duration: 'Polling duration',
		polling_duration_description:
			'Controls polling duration: lower value means faster polling however it can cause higher traffic for server',
		polling_duration_note: 'Choose polling duration before scanning',
		preserve_log: 'Preserve log',
		preserve_log_note: 'Do not clear log on reset',
		synchronization_trigger: 'Synchronization trigger',
		synchronization_trigger_description: "Trigger API call to sync data from customer's API if needed.",
		toggle_fullscreen: 'Toggle full screen',
		toggle_fullscreen_note: 'Use full screen mode to have larger view',
		transferred_data: 'Transferred data'
	},
	titles: {
		exchange_epc: 'Exchange EPC',
		exchange_order: 'Exchange manufacturing order',
		inbound_report: 'Inbound report',
		order_sizing_list: 'Order sizing list',
		transfer_order_datalist: 'Transfer order datalist',
		transfer_order_list: 'Transfer orders list'
	}
}
