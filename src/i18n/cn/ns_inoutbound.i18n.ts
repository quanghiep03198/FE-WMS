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
		imp_exp_reason: '出入庫類别',
		imp_archive_warehouse: '档案',
		imp_location: '储位'
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
		conflict_mono: '这批资料有两个指令进去 请再次读取'
	}
}
