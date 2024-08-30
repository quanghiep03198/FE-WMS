import { OrderStatus } from '@/common/constants/enums'

export default {
	counter_box: {
		label: '本次出入庫數量',
		caption: 'EPC自动更新每 {{value}} 秒'
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
		order_sizing_list: '下列表显示这次扫描的指令及尺码'
	}
}
