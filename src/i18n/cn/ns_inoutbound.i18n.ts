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
		transfer_information: '转仓信息'
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
		}
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
		order_sizing_list: '指令及尺码列表'
	},
	description: {
		transfer_order_list: '跟踪和管理转移订单',
		transfer_order_datalist: '从下面的表格中选择数据以添加新转移订单',
		order_sizing_list: '下列表显示这次扫描的指令及尺码',
		inoutbound_form_note: '更新库存移动之前断开连接'
	},
	rfid_toolbox: {
		network_status: '网络状态',
		internet_access: '互联网访问',
		latency: '延迟',
		cron_job: '计划任务状态',
		transferred_data: '已传输的数据',
		polling_duration: '轮询持续时间',
		polling_duration_note: '扫描前选择轮询持续时间',
		polling_duration_description: '控制轮询间隔时间：值越低，轮询越快，但可能导致服务器流量增加',
		toggle_fullscreen: '切换全屏模式',
		toggle_fullscreen_note: '使用全屏模式以获得更大的视图',
		preserve_log: '保留日志',
		preserve_log_note: '重置时不要清除日志'
	}
}
