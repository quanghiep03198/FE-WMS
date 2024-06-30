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
	}
}
