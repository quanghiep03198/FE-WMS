export default {
	labels: {
		username: '账号',
		password: '密码',
		remember_account: '记住我',
		forgot_password: '忘记密码?',
		logged_in_with: '已登入'
	},
	texts: {
		title: '登入系统',
		description: '进入用户和密码跟选择部门与可以登入系统'
	},
	notification: {
		authenticate_success: '确认登录成功',
		login_success: '登入成功',
		logout_success: '登出',
		login_failed: '登入失败',
		logout_failed: '登出失败'
	},
	actions: {
		go_to_dashboard: '转回主页'
	},
	validation: {
		require_account: '请登入账户',
		require_password: '请登入密码',
		require_company: '请登入公司/工厂',
		require_department: '请登入部门'
	},
	steps: {
		verify_account: '确认款号',
		select_department: '选择部门'
	}
} as const
