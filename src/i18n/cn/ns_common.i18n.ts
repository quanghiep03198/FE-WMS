export default {
	settings: {
		language: '语言',
		theme: '主题',
		function: '功能名称',
		font: '字体'
	},

	common_fields: {
		created_at: '创建日期',
		updated_at: '编辑日期',
		user_name_updated: '更新人員',
		actions: '操作',
		remark: '管理人',
		approver: '審核人',
		approver_time: '審核時間',
		quantity: '數量',
		total: '全部的'
	},
	actions: {
		add: '添加',
		adjust: '调整',
		update: '編輯',
		delete: '删除',
		dismiss: '忽略',
		save: '保存',
		save_changes: '保存更改',
		revert_changes: '恢复更改',
		cancel: '取消',
		submit: '确认',
		proceed: '确认',
		confirm: '确认',
		start: '开始',
		stop: '停止',
		continue: '继续',
		reset: '重置',
		finish: '完成',
		connect: '连接',
		disconnect: '断开',
		back: '返回',
		open: '打开',
		close: '关闭',
		login: '登入',
		logout: '登出',
		search: '查詢',
		reload: '重新加载',
		detail: '细节',
		clear_filter: '删除过滤',
		toggle_sidebar: '切换主侧边栏',
		toggle_theme: '切换主题',
		set_approval_status: '审核状态设置',
		approve: '批准',
		reapprove: '重新批准',
		cancel_approve: '取消批准',
		retry: '重试',
		load_more: '加载更多'
	},
	form_placeholder: {
		select: '-- Select {{object}} --',
		fill: 'Fill in {{object}}...',
		search: 'Search by {{object}} ...'
	},
	table: {
		selected_rows: '已选择 {{selectedRows}} 行',
		page: '第 {{page}} 页',
		rows_per_page: '展示',
		filter: '过滤',
		no_filter_applied: '不应用过滤器',
		no_data: '没有数据',
		search_in_column: '在栏目中搜索',
		no_match_result: '未找到结果.'
	},
	pagination: {
		next_page: '下页',
		previous_page: '上页',
		first_page: '第一页',
		last_page: '最后一页'
	},
	navigation: {
		settings: '建立',
		appearance: '外观',
		profile: '个人信息',
		account: '账户管理',
		keyboard_shortcut: '快捷键',
		dashboard: '首頁',
		fm_inoutbound: '倉庫出入庫作業',
		pm_inbound: '生产管理入库操作',
		warehouse_management: '倉庫管理',
		storage_detail: '仓库存储详情',
		import_management: '入庫管理',
		export_management: '出庫管理',
		transfer_managment: '調撥管理',
		inventory_management: '盤點管理',
		production_incoming_inspection: '進貨驗收作業管理',
		report_management: '報表管理'
	},
	notification: {
		establishing_connection: '建立连接 ...',
		processing_request: '正在处理请求 ...',
		success: '成功 !',
		error: '失败 !'
	},
	confirmation: {
		delete_title: '删除所以记录已选择',
		delete_description: '你确定想删除你的记录? 质料会完全删除并不可恢复',
		understand_and_proceed: '我同意及要继续'
	},
	errors: {
		'404': '不找到页面.',
		'404_message': '页面不存在. 请检查链接.',
		'403': '要就使用权',
		'403_message': '你不许访问页面.',
		'503': '功能不可用',
		'503_message': '功能正在开发/维护中。请稍后再试'
	},
	common_form_titles: {
		create: '加新{{object}}',
		update: '編輯{{object}}'
	},
	titles: {
		caution: '警告',
		general_settings: '常规设置'
	},
	status: {
		connecting: '连接中',
		connected: '已连接',
		disconnected: '已断开连接',
		running: '运行中',
		idle: '空闲',
		processing: '处理中 ...',
		loading: '载入中 ...'
	}
} as const
