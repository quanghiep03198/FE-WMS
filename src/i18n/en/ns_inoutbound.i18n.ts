import { OrderStatus } from '@/common/constants/enums'

export default {
	action_types: {
		warehouse_input: 'Warehouse input',
		warehouse_output: 'Warehouse output'
	},
	counter_box: {
		label: 'Scanned EPCs',
		caption: 'Data is streamed continuously when the connection is established.'
	},
	description: {
		add_outbound_size: 'Add size and quantity for this order to perform the outbound process.',
		archived_restoration: 'Restore archived data. Use only when necessary.',
		container_number_field:
			'BIC container code format. Skip this field in case container number is not available now.',
		create_truckload_delivery: 'Create new container loading information for outbound shipments from the factory',
		daily_inbound_report: 'View the scanned EPC data and perform warehouse inbound operations daily.',
		daily_outbound_report: 'View the scanned EPC data and perform warehouse outbound operations daily.',
		defective_goods_inbound_report: 'Manage and track the inbound of defective goods in the warehouse.',
		defective_goods_outbound_report: 'Manage and track the outbound of defective goods in the warehouse.',
		defective_goods_inventory_report: 'Manage and track the inventory of defective goods in the warehouse.',
		duplicate_po_added:
			'Do not add duplicate purchase orders, outbound quantity must not exceed the total ordered quantity.',
		exchange_all: 'You can exchange the entire EPC belonging to the selected size.',
		exchange_epc_dialog_desc:
			'Allows users to replace or update EPC tags on a product with a new manufacturing order.',
		inoutbound_form_note: 'Stop reading from RFID device and disconnect before updating stock moves.',
		list_of_already_scanned_epcs: 'List of EPCs that have been previously scanned for inbound.',
		license_plate_field:
			'License plate that coresponding to container number. Also skip entering license plate if container number is unknown.',
		monthly_inventory_report: 'Manage and track the monthly inventory of finished goods in the warehouse.',
		no_added_size: 'No size added',
		no_dispatch_order_item_added: 'No dispatch order item added',
		no_dispatch_order_item_added_caption: 'Please add at least one purchase order and outbound quantity to proceed.',
		no_exchangable_order: 'Only items with the same production code and size number can be exchanged.',
		order_size_detail:
			'View detailed quantity information for each size according to the production order. You can exchange EPC if necessary.',
		order_sizing_list: 'The table below shows the sizing information of the scanned orders.',
		inoutbound_table_caption: 'The table above summarizes the scanned EPC data.',
		po_outbound: 'The scanned EPC data will be counted according to this order after performing stock out.',
		inventory_estimation: 'Estimate the inventory levels based on the current production and shipping status.',
		select_readable_database:
			'Select a database connection to read the data. You can change it when there is no connection or the current connection has been interrupted.',
		select_writable_database:
			'Select a database connection to save the warehouse inbound/outbound data. Skip if the order is designated to be produced at the current factory.',
		select_order:
			'Select the production order to view its scanned EPC data and perform warehouse inbound or outbound operations.',
		select_rfid_process: 'Select the process to scan the corresponding tags for the responsible departments.',
		skip_select_tenant: 'Skip if the order is designated to be produced at the current factory.',
		transferred_order: 'The actual order code to be exchanged.',
		exchange_qty: 'Number of exchanged items for the actual order.',
		transfer_order_datalist: 'Pick the data from the table below to add new transfer orders.',
		transfer_order_list: 'Follow and manage transfer orders.',
		inbound_directive: 'Inbound directive',
		outbound_estimation: 'Estimated outbound quantity for the order',
		inbound_history_lookup: 'View inbound history, production order details, and daily received quantities.',
		inoutbound_history_lookup: 'Check information and history of inbound/outbound quantities by order',
		inventory_by_size: 'Inventory by size',
		inventory_by_size_desc: 'Product quantity information by each size of the product',
		inventory_audit: 'Warehouse inventory audit',
		inventory_audit_desc: 'List of inbound directives based on each product type',
		outbound_history_lookup: 'Review outbound history, order information, and daily shipped quantities.',
		outbound_order_estimation: 'Outbound progress evaluation',
		outbound_order_estimation_desc: 'Evaluate the outbound progress of each PO based on the number of scanned tags.',
		size_qty_caption: 'Total product quantity by size',
		empty_defect_item_caption:
			'No defective goods found. Please add defective goods to the list with the form beside.',
		defective_epc_caption:
			'Focus this input and scan the EPC tag of the defective goods. The EPC should be 24 characters long.',
		truckload_delivery: 'Manage container loading information for outbound shipments from the factory',
		update_truckload_delivery: 'Update container loading information for outbound shipments from the factory',
		request_change_dispatch_order_info:
			'A discrepancy in the shipment information has been detected; QC and warehouse officer must update the records.',
		confirm_dispatch_order_info:
			'Confirm that the dispatch information is accurate and authorize the shipment to leave the factory.',
		update_dispatch_order_signature_info: 'Update the signature confirming the dispatch information'
	},
	errors: {
		wrong_stamp: 'Wrong stamp.'
	},
	inoutbound_actions: {
		normal_export: 'Normal export',
		normal_import: 'Normal import',
		giveaway: 'Giveaway',
		recycle: 'Recycling',
		return_for_repair: 'Return for Repair',
		sell: 'Sell',
		scrap: 'Scrap',
		transfer_inbound: 'Transfer inbound',
		transfer_outbound: 'Transfer outbound'
	},
	labels: {
		delete_all: 'Delete all',
		delete_and_unscannable: 'Delete and do not rescan',
		exchange_all: 'Exchange all',
		io_archive_warehouse: 'Archived warehouse',
		io_reason: 'Import/Export reason',
		io_storage_location: 'Storage location',
		order_information: 'Order information',
		transfer_information: 'Transfer information',
		security_confirmation: 'Security guard confirmation',
		signature: 'Signature'
	},
	mo_no_box: {
		caption: 'You can determine which order should be used to import/export.',
		order_count: '{{ count }} order(s) found.'
	},
	notification: {
		already_inbound_epcs: 'Previously scanned inbound EPCs detected, check details and notify shaping department.',
		browser_tab_resumed: 'Welcome back',
		browser_tab_resumed_message:
			'Due to inactivity, the connection was temporarily closed to save system resources. Would you like to reconnect?',
		confirm_delete_all_mono: {
			title: 'Do you want to delete this order?',
			description: 'If you delete it, you have to rescan EPCs.'
		},
		exchange_order_caution:
			'The action of swapping production orders cannot be undone. Please make sure to confirm your changes before proceeding.',
		invalid_epc_deteted:
			'Invalid EPC detected. Please contact the shaping department for this issue, then move them to recycle.',
		navigation_blocked_caption: 'Unsaved tasks. Are you sure you want to leave the page right now?',
		navigation_blocked_message: 'Cancel scanning EPCs anyway?',
		stock_out_submission_caution:
			'Please check the information carefully before confirming the stock out. After confirmation, you cannot change this information.',
		too_many_mono: 'There are more than 3 commands scanned. Please check again.'
	},
	order_status: {
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.CANCELLED]: 'Cancelled',
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.REAPPROVED]: 'Reapproved'
	},
	placeholders: {
		enter_storage_location: 'Enter storage location ...',
		outbound_purpose: 'Outbound purpose ...',
		max_qty: 'Max {{qty}} (prs)'
	},
	rfid_process: {
		cutting_inbound: 'Cutting Inbound',
		production_management_inbound: 'P.M Inbound',
		shaping_inbound: 'Shaping Inbound'
	},
	scanner_setting: {
		adjust_setting_description: 'Adjust RFID Playground settings.',
		cron_job: 'Job status',
		synchronization: 'Synchronization',
		data_restoration: 'Data restoration',
		restore_deleted_epcs: 'Restore deleted EPC',
		data_restoration_note: 'Revert deleted EPCs to restore them to inventory.',
		developer_mode: 'Developer mode',
		developer_mode_note: 'Enable developer mode for more advanced features.',
		fetch_oder_data_note: "Allows you to scan EPCs that weren't imported/exported from previous days.",
		fetch_older_data: 'Fetch older data',
		server_connection: 'Server connection',
		latency: 'Latency',
		network_status: 'Network status',
		decker_data_synchronization: "Deckers's data synchronization",
		decker_data_synchronization_description: 'Select a factory that the unknown manufacturing orders belong to',
		toggle_fullscreen: 'Toggle full screen',
		toggle_fullscreen_note: 'Use full screen mode for a larger view.',
		transferred_data: 'Transferred data'
	},
	titles: {
		archived_restoration: 'Archived restoration',
		combination_history: 'Combination history',
		create_truckload_delivery: 'Create truckload delivery',
		daily_inbound_report: 'Daily inbound report',
		daily_outbound_report: 'Daily outbound report',
		defective_goods_inventory_report: 'Defective goods inventory report',
		exchange_epc: 'Exchange EPC',
		exchange_order: 'Exchange manufacturing order',
		file_daily_inbound_report: 'Daily Inbound Report {{factory}} - {{date}}',
		file_daily_outbound_report: 'Daily Outbound Report {{factory}} - {{date}}',
		file_daily_defective_goods_inbound_report: 'Daily Defective Goods Inbound Report {{factory}} - {{date}}',
		file_daily_defective_goods_outbound_report: 'Daily Defective Goods Outbound Report {{factory}} - {{date}}',
		file_defective_goods_inventory_report: 'Defective goods inventory - {{factory}}',
		file_production_inventory_summary: 'Production Inventory Summary - {{factory}}',
		file_monthly_inventory_report: 'Monthly Inventory Report {{factory}} - {{month}}',
		file_truckload_delivery_report: 'Warehouse Truckload Delivery Report - {{factory}}',
		inbound_history: 'Inbound history',
		inoutbound_history_lookup: 'In/Outbound history lookup',
		outbound_history: 'Outbound history',
		monthly_inventory_report: 'Monthly inventory report',
		order_sizing_list: 'Order sizing list',
		production_inventory_summary: 'Production inventory summary',
		transfer_order_datalist: 'Transfer order datalist',
		transfer_order_list: 'Transfer orders list',
		update_truckload_delivery: 'Update truckload delivery'
	},
	shoes_category: {
		b_grade: 'B Grade',
		c_grade: 'C Grade',
		research_development: 'Research & Development'
	}
}
