import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: '本次出入庫數量',
		caption: '在连接开启时, EPC 数据会从服务器持续传输.'
	},
	mo_no_box: {
		caption: '您可以选择需要导入/导出的指令',
		order_count: '找到 {{ count }} 个订单'
	},
	action_types: {
		warehouse_input: '入庫',
		warehouse_output: '出庫'
	},
	labels: {
		io_reason: '出入庫類别',
		io_archive_warehouse: '仓库别',
		io_storage_location: '储位',
		order_information: '订单信息',
		transfer_information: '转仓信息',
		exchange_all: '全部交换'
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
		too_many_mono: '已扫描到超过3个命令. 请重新检查',
		navigation_blocked_message: '现在停读 ?',
		navigation_blocked_caption: '操做没保存. 你确认想离开页面吗 ?',
		confirm_delete_all_mono: {
			title: '您確定要刪除此命令嗎 ?',
			description: '如果您刪除它, 則必須重新執行EPC掃描操作.'
		},
		exchange_order_caution: '操作后不能还原，确定要换指令？'
	},
	rfid_process: {
		production_management_inbound: '生产管理入库',
		cutting_inbound: '裁剪入库'
	},
	order_status: {
		[OrderStatus.NOT_APPROVED]: '未審核',
		[OrderStatus.APPROVED]: '已審核',
		[OrderStatus.CANCELLED]: '取消審核 ',
		[OrderStatus.REAPPROVED]: '重新審核'
	},

	titles: {
		transfer_order_list: '转移订单列表',
		transfer_order_datalist: '转移订单数据列表',
		order_sizing_list: '指令及尺码列表',
		exchange_epc: '交换 EPC',
		exchange_order: '交换生产订单'
	},
	description: {
		transfer_order_list: '跟踪和管理转移订单',
		transfer_order_datalist: '从下面的表格中选择数据以添加新转移订单',
		order_sizing_list: '下列表显示这次扫描的指令及尺码',
		inoutbound_form_note: '更新库存移动之前断开连接',
		select_order: '选择生产订单以查看已扫描的EPC数据并进行入库或出库操作.',
		select_database: '选择数据库连接以读取数据. 当没有连接或当前连接已断开时，您可以更改.',
		order_size_detail: '根据生产订单查看每个尺码的详细数量信息. 如有必要，您可以调整标签.',
		no_exchangable_order: '没有可交换的顺序',
		exchange_epc_dialog_desc: '允许用户用新的生产订单替换或更新产品上的 EPC 标签.',
		transferred_order: '要交换的实际订单代码',
		exchange_qty: '实际订单的交换商品数量',
		exchange_all: '您可以交换属于所选尺码的整个 EPC'
	},
	scanner_setting: {
		network_status: '网络状态',
		internet_access: '互联网访问',
		latency: '延迟',
		cron_job: '计划任务状态',
		transferred_data: '已传输的数据',
		polling_duration: '轮询持续时间',
		polling_duration_note: '扫描前选择轮询持续时间',
		polling_duration_description: '控制轮询间隔时间：值越低，轮询越快，但可能导致服务器流量增加',
		fetch_older_data: '获取更多数据',
		fetch_oder_data_note: '允许您扫描未从前几天导入/导出的EPC',
		toggle_fullscreen: '切换全屏模式',
		toggle_fullscreen_note: '使用全屏模式以获得更大的视图',
		preserve_log: '保留日志',
		preserve_log_note: '重置时不要清除日志',
		developer_mode: '开发者模式',
		developer_mode_note: '启用开发者模式以获取更多高级功能'
	}
}
