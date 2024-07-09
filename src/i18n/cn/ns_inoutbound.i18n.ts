export default {
	counter_box: {
		label: '本次出入庫數量',
		caption: 'EPC自动更新每 {{value}} 秒'
	},
	action_types: {
		warehouse_input: '入庫',
		warehouse_output: '出庫'
	},
	labels: {
		io_reason: '出入庫類别',
		io_archive_warehouse: '仓库别',
		io_storage_location: '储位'
	},
	inoutbound_actions: {
		normal_import: '正常入庫',
		normal_export: '正常出庫',
		scrap: '報廢',
		transfer_outbound: '調撥出庫',
		transfer_inbound: '調攒入庫',
		recycling: '翻箱',
		return_for_repair: '返修'
	},
	notification: {
		conflict_mono: '这批资料有两个指令进去 请再次读取',
		navigation_blocked_message: '现在停读 ?',
		navigation_blocked_caption: '操做没保存. 你确认想离开页面吗 ?'
	},
	fields: {
		mo_no: '指令碼',
		or_no: '訂單編號',
		or_custpo: '客戶訂單',
		// I/O product inspection
		status_approve: '審核',
		sno_no: '驗收單號',
		sno_date: '驗收日期',
		sno_sealnumber: '封條號碼',
		sno_container: '貨櫃號碼',
		sno_total_boxes: '箱數合計',
		packaging_code: '裝箱單號',
		sno_car_number: '車號',
		ship_order: '裝貨號碼',
		dept_name: '更新部門',
		employee_name: '建檔人姓名',
		sno_total: '數量合計',
		sno_size: '肥度',
		sno_type: '左右',
		// product inspection details
		container_order_code: '出櫃單號', //mã đơn xuất công
		order_qty: '採購數量', //số lượng đơn đặt hàng
		uninspected_qty: '未驗收量',
		inspected_qty: '已驗收量',
		returned_qty: '已退貨量',
		conversion_rate: '換算率',
		required_date: '需求日期'
	}
}
