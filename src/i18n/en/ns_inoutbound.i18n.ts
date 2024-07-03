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
		io_storage_location: 'Storage location'
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
		// I/O production
		status_approve: '審核',
		sno_no: '驗收單號',
		sno_date: '驗收日期',
		sno_sealnumber: '封條號碼',
		sno_container: '貨櫃號碼',
		sno_total_boxes: '箱數合計',
		sno_car_number: '車號',
		ship_order: '裝貨號碼',
		dept_name: '更新部門',
		employee_name: '建檔人姓名',
		// product inspection details
		container_order_code: 'Container Order Code',
		order_qty: 'Order quantity',
		uninspected_qty: 'Uninspected quantity',
		inspected_qty: 'Inspected quantity',
		returned_qty: 'Returned quantity',
		conversion_rate: 'Conversion rate',
		required_date: 'Required date'
	}
}
