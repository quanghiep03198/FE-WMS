export default {
	language: '语言',
	theme: '主题',
	function: '功能名称',
	common_fields: {
		created_at: '创建日期',
		updated_at: '编辑日期',
		actions: '操作',
		remark: '管理人'
	},
	actions: {
		add: '添加',
		update: '修改',
		delete: '删除',
		save: '保存',
		cancel: '取消',
		submit: '确认',
		continue: '继续',
		back: '返回',
		close: '关闭',
		login: '登入',
		logout: '登出',
		search: '查詢',
		toggle_sidebar: '切换主侧边栏',
		toggle_theme: '切换主题'
	},
	table: {
		selected_rows: '已选择 {{selectedRows}} 行',
		page: '第 {{page}} 页',
		display: '展示',
		filter: '过滤',
		no_filter_applied: '不应用过滤器'
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
		wh_dashboard: '儲位管理',
		wh_management: '倉庫管理',
		wh_import_management: '入庫管理',
		wh_export_management: '出庫管理',
		wh_transfer_managment: '調撥管理',
		wh_inventory_management: '盤點管理',
		wh_exchange_n_return_management: '進貨驗收作業管理',
		wh_report_management: '報表管理'
	},
	notification: {
		processing_request: '正在处理请求 ...',
		success: '成功 !',
		error: '失败 !'
	},
	errors: {
		'404': '不找到页面.',
		'404_message': '页面不存在. 请检查链接.',
		'403': '要就使用权',
		'403_message': '你不许访问页面.',
		'503': '功能不可用',
		'503_message': '功能正在开发/维护中。请稍后再试'
	}
} as const
