import { OrderStatus } from '@common/constants/enums'
import { DefectiveGoodsSource } from '@features/defective-goods/constants/enums'

export default {
	action_types: {
		warehouse_input: '入庫',
		warehouse_output: '出庫'
	},
	counter_box: {
		label: '本次出入庫數量',
		caption: '在连接开启时, EPC 数据会从服务器持续传输.'
	},
	description: {
		add_outbound_size: '添加尺码和数量以执行出库操作',
		archived_restoration: '恢复已存档的数据. 仅在必要时使用.',
		container_condition_assessment: '请评估以下集装箱状况（如有）',
		container_number_field: 'BIC 集装箱代码格式. 如果当前无法提供集装箱编号, 请跳过此字段.',
		create_truckload_delivery: '创建卡车装运信息以从工厂出货',
		daily_inbound_report: '跟踪和管理每日成品仓库入库进度',
		daily_outbound_report: '跟踪和管理每日成品仓库出库进度',
		defective_goods_inbound_report: '管理和跟踪仓库中次品的入库',
		defective_goods_outbound_report: '管理和跟踪仓库中次品的出库',
		defective_goods_inventory_report: '管理和跟踪仓库中次品的库存',
		duplicate_po_added: '不要添加重复的采购订单, 出库数量不得超过订购的总数量.',
		exchange_all: '您可以交换属于所选尺码的整个 EPC',
		exchange_epc_dialog_desc: '允许用户用新的生产订单替换或更新产品上的 EPC 标签.',
		exchange_qty: '实际订单的交换商品数量',
		inventory_by_size: '按尺码查询成品仓库库存数量',
		inoutbound_form_note: '在更新库存移动之前停止从 RFID 设备读取数据.',
		list_of_already_scanned_epcs: '以前扫描入库的EPC列表.',
		license_plate_field: '与集装箱编号对应的车牌号. 如果集装箱编号未知, 也可跳过输入车牌号.',
		monthly_inventory_report: '管理和跟踪成品仓库的每月库存',
		no_added_size: '没有添加尺码',
		no_dispatch_order_item_added: '没有添加采购订单',
		no_dispatch_order_item_added_caption: '请至少添加一个采购订单和出库数量以继续.',
		no_exchangable_order: '没有可交换的订单',
		order_size_detail: '根据生产订单查看每个尺码的详细数量信息. 如有必要，您可以调整标签.',
		order_sizing_list: '下列表显示这次扫描的指令及尺码',
		inoutbound_table_caption: '上表总结了扫描的EPC数据',
		inoutbound_history_not_found: '未找到此订单的入库/出库历史记录. 请再次检查您输入的订单代码.',
		po_outbound: '按容器出库的订单代码. 根据此订单计算当天扫描的EPC数据.',
		inventory_estimation: '根据当前生产和出货状态估算库存水平.',
		select_readable_database: '选择数据库连接以读取数据. 当没有连接或当前连接已断开时，您可以更改.',
		select_writable_database: '选择数据库连接以保存仓库入库/出库数据. 如果订单指定在当前工厂生产，请跳过.',
		select_order: '选择生产订单以查看已扫描的EPC数据并进行入库或出库操作.',
		select_rfid_process: '选择与各自部门相对应的扫描过程',
		skip_select_tenant: '如果订单指定在当前工厂生产，请跳过.',
		transferred_order: '要交换的实际订单代码',
		transfer_order_datalist: '从下面的表格中选择数据以添加新转移订单',
		transfer_order_list: '跟踪和管理转移订单',
		inbound_directive: '入库指令',
		outbound_estimation: '订单的预计出库数量',
		inbound_history_lookup: '查看入库历史、生产指令详情及每日入库数量.',
		inoutbound_history_lookup: '检查按订单分类的入库/出库数量信息和历史记录',
		inventory_by_size_desc: '执行查询后，将按产品尺码显示库存数量.',
		inventory_audit: '入库库存审计',
		inventory_audit_desc: '查询完成后，相关入库记录将在此处展示.',
		outbound_history_lookup: '查看出库历史、订单信息及每日出库数量.',
		outbound_order_estimation: '预计出库订单',
		outbound_order_estimation_desc: '执行出库预估查询后，结果将自动加载至此区域.',
		size_qty_caption: '按尺码统计的总产品数量',
		empty_defect_item_caption: '没有不良品数据. 请使用旁边的表单添加不良品.',
		defective_epc_caption: '请将输入框聚焦, 然后扫描不良品的EPC标签. EPC应为24个字符.',
		truckload_delivery: '管理从工厂出货的集装箱装载信息.',
		update_truckload_delivery: '更新卡车装运信息以反映任何更改或修改.',
		request_change_dispatch_order_info: '已发现出货信息存在差异; 品管和仓库人员必须更新相关记录.',
		confirm_dispatch_order_info: '确认出货信息准确无误, 并批准货物离开工厂.',
		update_dispatch_order_signature_info: '更新确认出货信息的签名'
	},
	errors: {
		wrong_stamp: '错误的标签'
	},
	inoutbound_actions: {
		downgrade: 'B转C',
		giveaway: '給客人',
		lab: '实验室检验',
		normal_export: '正常出庫',
		normal_import: '正常入庫',
		recycle: '翻箱',
		shipping: '出货',
		return_for_repair: '返修',
		ruin: 'C品销毁',
		scrap: '報廢',
		transfer_inbound: '調攒入庫',
		transfer_outbound: '調撥出庫'
	},
	labels: {
		delete_all: '删除全部',
		delete_and_unscannable: '删除并不再扫描',
		exchange_all: '全部交换',
		inoutbound_method: '入/出库方法',
		io_archive_warehouse: '仓库别',
		io_reason: '出入庫類别',
		io_storage_location: '储位',
		order_information: '订单信息',
		transfer_information: '转仓信息',
		security_confirmation: '保安确认',
		signature: '签名'
	},
	mo_no_box: {
		caption: '您可以选择需要导入/导出的指令',
		order_count: '找到 {{ count }} 个订单'
	},
	notification: {
		already_inbound_epcs: '發現標簽已入庫, 請通知給成型人員.',
		browser_tab_resumed: '浏览器标签已恢复',
		browser_tab_resumed_message: '由于长时间未操作，连接已暂时断开以节省系统资源。是否重新连接?',

		confirm_delete_all_mono: {
			description: '如果您刪除它, 則必須重新執行EPC掃描操作.',
			title: '您確定要刪除此命令嗎 ?'
		},
		exchange_order_caution: '操作后不能还原，确定要换指令？',
		invalid_epc_deteted: '检测到无效的EPC。请联系成型部门解决此问题, 然后将其移至回收',
		navigation_blocked_caption: '操做没保存. 你确认想离开页面吗 ?',
		navigation_blocked_message: '现在停读 ?',
		stock_out_submission_caution: '请在确认出库前仔细检查信息. 确认后, 您将无法更改此信息.',
		too_many_mono: '已扫描到超过3个命令. 请重新检查'
	},
	order_status: {
		[OrderStatus.APPROVED]: '已審核',
		[OrderStatus.CANCELLED]: '取消審核 ',
		[OrderStatus.NOT_APPROVED]: '未審核',
		[OrderStatus.REAPPROVED]: '重新審核'
	},
	placeholders: {
		enter_storage_location: '输入储位 ...',
		outbound_purpose: '选择出库类别 ...',
		max_qty: '最大 {{qty}} (prs)',
		select_rfid_device: '选择 RFID 设备'
	},
	rfid_process: {
		cutting_inbound: '裁断入库',
		production_management_inbound: '生产管理入库',
		shaping_inbound: '定型入库 '
	},
	scanner_setting: {
		adjust_setting_description: '调整RFID游乐场设置',
		cron_job: '计划任务状态',
		synchronization: '数据同步',
		data_restoration: '数据恢复',
		restore_deleted_epcs: '恢复已删除的EPC',
		data_restoration_note: '恢复数据将覆盖当前数据库中的所有数据',
		developer_mode: '开发者模式',
		developer_mode_note: '启用开发者模式以获取更多高级功能',
		fetch_oder_data_note: '允许您扫描未从前几天导入/导出的EPC',
		fetch_older_data: '获取更多数据',
		server_connection: '服务器连接',
		latency: '延迟',
		network_status: '网络状态',
		polling_duration: '轮询持续时间',
		toggle_fullscreen: '切换全屏模式',
		toggle_fullscreen_note: '使用全屏模式以获得更大的视图',
		transferred_data: '已传输的数据',
		decker_data_synchronization: 'Deckers 数据同步',
		decker_data_synchronization_description: '选择没有生产数据的工厂以进行同步'
	},
	titles: {
		archived_restoration: '已存档数据恢复',
		container_condition_assessment: '集装箱状况评估',
		combination_history: '配标历史',
		create_truckload_delivery: '创建卡车装运',
		daily_inbound_report: '入庫报表',
		daily_outbound_report: '出庫报表',
		defective_goods_inventory_report: '二级鞋存库报表',
		monthly_inventory_report: '库存报表',
		exchange_epc: '交换 EPC',
		exchange_order: '交换生产订单',
		file_daily_inbound_report: '{{factory}}每日入库报告 - {{date}}',
		file_daily_outbound_report: '{{factory}}每日出库报告 - {{date}}',
		file_defective_goods_inventory_report: '{{factory}}二级鞋存库报表',
		file_daily_defective_goods_inbound_report: '{{factory}}二級品每日入庫報表 - {{date}}',
		file_daily_defective_goods_outbound_report: '{{factory}}二級品每日出庫報表 - {{date}}',
		file_monthly_inventory_report: '{{factory}}库存报表 - {{month}}',
		file_production_inventory_summary: '{{factory}}二级鞋存库报表',
		file_shaping_department_productivity_report: '{{factory}}成型产量报表 - {{date}}',
		file_truckload_delivery_report: '{{factory}}成品仓按车辆出货报告',
		inbound_history: '入库历史',
		inoutbound_history_lookup: '入/出库历史查询',
		outbound_history: '出库历史',
		order_sizing_list: '指令及尺码列表',
		production_inventory_summary: '成品库存总表',
		transfer_order_datalist: '转移订单数据列表',
		transfer_order_list: '转移订单列表',
		update_truckload_delivery: '更新卡车装运.'
	},
	shoes_category: {
		b_grade: 'B级品',
		c_grade: 'C级品',
		research_development: '样品'
	},
	shoes_source: {
		[DefectiveGoodsSource.FINAL_INSPECTION]: '成品检验',
		[DefectiveGoodsSource.ASSEMBLY]: '成型线',
		[DefectiveGoodsSource.REPACKING]: '翻箱',
		[DefectiveGoodsSource.OVERRUN]: '多生产'
	}
}
