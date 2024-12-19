export default {
	actions: {
		add: '添加',
		adjust: '调整',
		approve: '批准',
		back: '返回',
		cancel: '取消',
		cancel_approve: '取消批准',
		clear_filter: '删除过滤',
		close: '关闭',
		confirm: '确认',
		connect: '连接',
		continue: '继续',
		delete: '删除',
		detail: '细节',
		disconnect: '断开',
		dismiss: '忽略',
		export: '导出',
		finish: '完成',
		load_more: '加载更多',
		login: '登入',
		logout: '登出',
		open: '打开',
		proceed: '确认',
		reapprove: '重新批准',
		reload: '重新加载',
		report_bug: '报告错误',
		reset: '重置',
		retry: '重试',
		revert_changes: '恢复更改',
		save: '保存',
		save_changes: '保存更改',
		search: '查詢',
		set_approval_status: '审核状态设置',
		start: '开始',
		stop: '停止',
		submit: '确认',
		toggle_sidebar: '切换主侧边栏',
		toggle_theme: '切换主题',
		update: '編輯'
	},
	common_fields: {
		actions: '操作',
		approver: '審核人',
		approver_time: '審核時間',
		created_at: '创建日期',
		quantity: '數量',
		remark: '管理人',
		status: '狀態',
		total: '全部的',
		updated_at: '编辑日期',
		user_name_updated: '更新人員'
	},
	common_form_titles: {
		create: '加新{{object}}',
		update: '編輯{{object}}'
	},
	confirmation: {
		delete_description: '你确定想删除你的记录? 质料会完全删除并不可恢复',
		delete_title: '删除所以记录已选择',
		understand_and_proceed: '我同意及要继续'
	},
	errors: {
		'403': '要就使用权',
		'403_message': '你不许访问页面.',
		'404': '不找到页面.',
		'404_message': '页面不存在. 请检查链接.',
		'503': '功能不可用',
		'503_message': '功能正在开发/维护中。请稍后再试'
	},
	form_placeholder: {
		fill: 'Fill in {{object}}...',
		search: 'Search by {{object}} ...',
		select: '-- Select {{object}} --'
	},
	navigation: {
		account: '账户管理',
		appearance: '外观',
		dashboard: '首頁',
		fm_inoutbound: '倉庫出入庫作業',
		import_management: '入庫管理',
		inventory_management: '盤點管理',
		keyboard_shortcut: '快捷键',
		pm_inbound: '生产管理入库操作',
		production_incoming_inspection: '進貨驗收作業管理',
		profile: '个人信息',
		report_management: '報表管理',
		settings: '建立',
		storage_detail: '仓库存储详情',
		transfer_managment: '調撥管理',
		warehouse_management: '倉庫管理',
		export_management: '出庫管理'
	},
	notification: {
		downloading: '下载 ...',
		establishing_connection: '建立连接 ...',
		error: '失败 !',
		processing_request: '正在处理请求 ...',
		success: '成功 !',
		receiving_data: '等待数据 ...'
	},
	pagination: {
		first_page: '第一页',
		last_page: '最后一页',
		next_page: '下页',
		previous_page: '上页'
	},
	settings: {
		font: '字体',
		function: '功能名称',
		language: '语言',
		theme: '主题'
	},
	status: {
		connected: '已连接',
		connecting: '连接中',
		disconnected: '已断开连接',
		idle: '空闲',
		loading: '载入中 ...',
		processing: '处理中 ...',
		running: '运行中'
	},
	table: {
		filter: '过滤',
		no_data: '没有数据',
		no_filter_applied: '不应用过滤器',
		no_match_result: '未找到结果.',
		page: '第 {{page}} 页',
		problem_arises: '问题出现',
		rows_per_page: '展示',
		search_in_column: '在栏目中搜索',
		selected_rows: '已选择 {{selectedRows}} 行'
	},
	titles: {
		caution: '警告',
		general_settings: '常规设置'
	}
} as const
