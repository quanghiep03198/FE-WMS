import { OrderStatus } from '@common/constants/enums'
import { DefectiveGoodsSource } from '@features/defective-goods/constants/enums'

export default {
	action_types: {
		recall: 'Recall',
		stock_in: 'Stock In',
		stock_out: 'Stock Out'
	},
	counter_box: {
		caption: 'Data is streamed continuously when the connection is established.',

		label: 'Scanned EPCs'
	},
	description: {
		add_outbound_size: 'Add size and quantity for this order to perform the outbound process.',
		archived_restoration: 'Restore archived data. Use only when necessary.',
		close_monthly_inventory:
			'Are you sure you want to close the monthly inventory? After closing, you will not be able to change the inventory information for this month.',
		confirm_dispatch_order_info:
			'Confirm that the dispatch information is accurate and authorize the shipment to leave the factory.',
		container_condition_assessment:
			'Please select all that apply regarding the condition of the container (if exists)',
		container_number_field: 'BIC container code format including the country code and owner code.',
		create_truckload_delivery: 'Create new container loading information for outbound shipments from the factory',
		current_stock_transaction: 'View the current stock transaction for the selected stock flow.',
		daily_inbound_report: 'View the scanned EPC data and perform warehouse inbound operations daily.',
		daily_outbound_report: 'View the scanned EPC data and perform warehouse outbound operations daily.',
		defective_epc_caption:
			'Focus this input and scan the EPC tag of the defective goods. The EPC should be 24 characters long.',
		defective_goods_inbound_report: 'Manage and track the inbound of defective goods in the warehouse.',
		defective_goods_inventory_report: 'Manage and track the inventory of defective goods in the warehouse.',
		defective_goods_outbound_report: 'Manage and track the outbound of defective goods in the warehouse.',
		duplicate_po_added:
			'Do not add duplicate purchase orders and outbound quantity must not exceed the total ordered quantity.',
		empty_defect_item_caption:
			'No defective goods found. Please add defective goods to the list with the form beside.',
		exchange_all: 'You can exchange the entire EPC belonging to the selected size.',
		exchange_epc_dialog_desc:
			'Allows users to replace or update EPC tags on a product with a new manufacturing order.',
		inbound_directive: 'Inbound directive',
		inbound_history_lookup: 'View inbound history, production order details, and daily received quantities.',
		inoutbound_form_note: 'Stop reading from RFID device before updating stock moves.',
		inoutbound_history_lookup: 'Check information and history of inbound/outbound quantities by order',
		inoutbound_history_not_found:
			'No inbound/outbound history found for this order. Please check the order code you entered again.',
		inoutbound_table_caption: 'The table above summarizes the scanned EPC data.',
		inventory_audit: 'Warehouse inventory audit',
		inventory_audit_desc: 'List of inbound directives based on each product type',
		inventory_by_size: 'Inventory by size',
		inventory_by_size_desc: 'Product quantity information by each size of the product',
		inventory_estimation: 'Estimate the inventory levels based on the current production and shipping status.',
		license_plate_field:
			'License plate that coresponding to container number. Also skip entering license plate if container number is unknown.',
		list_of_already_scanned_epcs: 'List of EPCs that have been previously scanned for inbound.',
		monthly_inventory_report: 'Manage and track the monthly inventory of finished goods in the warehouse.',
		no_added_size: 'No size added',
		no_dispatch_order_item_added: 'No dispatch order item added',
		no_dispatch_order_item_added_caption: 'Please add at least one purchase order and outbound quantity to proceed.',
		no_exchangable_order: 'Only items with the same production code and size number can be exchanged.',
		order_size_detail:
			'View detailed quantity information for each size according to the production order. You can exchange EPC if necessary.',
		order_sizing_list: 'The table below shows the sizing information of the scanned orders.',
		outbound_estimation: 'Estimated outbound quantity for the order',
		outbound_history_lookup: 'Review outbound history, order information, and daily shipped quantities.',
		outbound_order_estimation: 'Outbound progress evaluation',
		outbound_order_estimation_desc: 'Evaluate the outbound progress of each PO based on the number of scanned tags.',
		request_change_dispatch_order_info:
			'A discrepancy in the shipment information has been detected; Import-Export department and warehouse officer must update the records.',
		rollback_stock_transaction:
			'After rolling back this transaction, the stock quantity will be reverted to its previous state. Are you sure you want to proceed?',

		seal_number_field: 'Seal number that coresponding to container number',
		select_order:
			'Select the production order to view its scanned EPC data and perform warehouse inbound or outbound operations.',
		size_qty_caption: 'Total product quantity by size',
		transferred_order: 'The actual order code to be exchanged.',
		truckload_delivery: 'Manage container loading information for outbound shipments from the factory',
		update_dispatch_order_signature_info: 'Update the signature confirming the dispatch information',
		update_truckload_delivery: 'Update container loading information for outbound shipments from the factory'
	},
	inoutbound_actions: {
		close_monthly_inventory: 'Close inventory',
		downgrade: 'B to C-Grade',
		giveaway: 'Giveaway',
		lab: 'Lab',
		normal_export: 'Normal export',
		normal_import: 'Normal import',
		recycle: 'Recycling',
		return_for_repair: 'Return for Repair',
		ruin: 'Ruin',
		scrap: 'Scrap',
		shipping: 'Shipping',
		transfer_inbound: 'Transfer inbound',
		transfer_outbound: 'Transfer outbound'
	},
	labels: {
		delete_all: 'Delete all',
		delete_and_unscannable: 'Delete and do not rescan',
		exchange_all: 'Exchange all',
		inoutbound_method: 'In/Outbound method',
		io_archive_warehouse: 'Archived warehouse',
		io_storage_location: 'Storage location',
		security_confirmation: 'Security guard confirmation',
		signature: 'Signature'
	},
	mo_no_box: {
		caption: 'You can determine which order should be used to import/export.'
	},
	notification: {
		already_inbound_epcs: 'Previously scanned inbound EPCs detected, check details and notify shaping department.',
		browser_tab_resumed: 'Welcome back',
		browser_tab_resumed_message:
			'Due to inactivity, the connection was temporarily closed to save system resources. Would you like to reconnect?',
		confirm_delete_all_mono: {
			description: 'If you delete it, you have to rescan EPCs.',

			title: 'Do you want to delete this order?'
		},
		exchange_order_caution:
			'The action of swapping production orders cannot be undone. Please make sure to confirm your changes before proceeding.',
		invalid_epc_deteted:
			'Invalid EPC detected. Please contact the shaping department for this issue, then move them to recycle.',
		navigation_blocked_caption: 'Unsaved tasks. Are you sure you want to leave the page right now?',
		navigation_blocked_message: 'Cancel scanning EPCs anyway?',
		posible_incorrect_po: 'The PO might be incorrect. Do you want to continue saving anyway?',

		too_many_mono: 'There are more than 3 commands scanned. Please check again.'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: 'Not approved',
		[OrderStatus.APPROVED]: 'Approved',
		[OrderStatus.REAPPROVED]: 'Reapproved',

		[OrderStatus.CANCELLED]: 'Cancelled'
	},
	placeholders: {
		enter_storage_location: 'Enter storage location ...',
		max_qty: 'Max {{qty}} (prs)',
		outbound_purpose: 'Outbound purpose ...',
		select_rfid_device: 'Select RFID device'
	},
	rfid_process: {
		cutting_inbound: 'Cutting Inbound',
		production_management_inbound: 'P.M Inbound',
		shaping_inbound: 'Shaping Inbound'
	},
	scanner_setting: {
		cron_job: 'Job status',
		data_restoration: 'Data restoration',
		data_restoration_note: 'Revert deleted EPCs to restore them to inventory.',
		decker_data_synchronization: "Deckers's data synchronization",
		decker_data_synchronization_description: 'Select a factory that the unknown manufacturing orders belong to',
		network_status: 'Network status',
		restore_deleted_epcs: 'Restore deleted EPC',
		server_connection: 'Server connection',
		synchronization: 'Synchronization',
		toggle_fullscreen: 'Toggle full screen',
		toggle_fullscreen_note: 'Use full screen mode for a larger view.'
	},
	shoes_category: {
		b_grade: 'B Grade',
		c_grade: 'C Grade',
		research_development: 'Research & Development'
	},
	shoes_source: {
		[DefectiveGoodsSource.FINAL_INSPECTION]: 'Final inspection',
		[DefectiveGoodsSource.ASSEMBLY]: 'Assembly',
		[DefectiveGoodsSource.REPACKING]: 'Repacking',
		[DefectiveGoodsSource.OVERRUN]: 'Overrun'
	},

	titles: {
		archived_restoration: 'Archived restoration',
		close_monthly_inventory: 'Confirm to close the monthly inventory?',
		combination_history: 'Combination history',
		container_condition_assessment: 'Container condition assessment',
		create_truckload_delivery: 'Create truckload delivery',
		current_stock_transaction: 'Current stock transaction',
		daily_inbound_report: 'Daily inbound report',
		daily_outbound_report: 'Daily outbound report',
		defective_goods_inventory_report: 'Defective goods inventory report',
		dispatch_order_detail: 'Dispatch order detail',
		exchange_epc: 'Exchange EPC',
		exchange_order: 'Exchange manufacturing order',
		file_daily_defective_goods_inbound_report: 'Daily Defective Goods Inbound Report {{factory}} - {{date}}',
		file_daily_defective_goods_outbound_report: 'Daily Defective Goods Outbound Report {{factory}} - {{date}}',
		file_daily_inbound_report: 'Daily Inbound Report {{factory}} - {{date}}',
		file_daily_outbound_report: 'Daily Outbound Report {{factory}} - {{date}}',
		file_defective_goods_inventory_report: 'Defective goods inventory - {{factory}}',
		file_monthly_inventory_report: 'Monthly Inventory Report {{factory}} - {{month}}',
		file_production_inventory_summary: 'Production Inventory Summary - {{factory}}',
		file_truckload_delivery_report: 'Warehouse Truckload Delivery Report - {{factory}}',
		inbound_history: 'Inbound history',
		inoutbound_history_lookup: 'In/Outbound history lookup',
		monthly_inventory_report: 'Monthly inventory report',
		order_sizing_list: 'Order sizing list',
		outbound_history: 'Outbound history',
		production_inventory_summary: 'Production inventory summary',
		rollback_stock_transaction: 'Rollback this transaction?',

		update_truckload_delivery: 'Update truckload delivery'
	}
}
