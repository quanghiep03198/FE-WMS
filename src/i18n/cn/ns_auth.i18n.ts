export default {
	actions: {
		go_to_dashboard: '转回主页'
	},
	labels: {
		forgot_password: '忘记密码?',
		logged_in_with: '已登入',
		password: '密码',
		remember_account: '记住我',
		username: '账号'
	},
	notification: {
		authenticate_success: '确认登录成功',
		login_failed: '登入失败',
		login_success: '登入成功',
		logout_failed: '登出失败',
		logout_success: '登出'
	},
	profile: {
		change_password: '更改密碼',
		change_password_to_access: '更改密碼以存取您的帳戶',
		company: '公司',
		current_password: '目前密碼',
		display_name: '顯示名稱',
		email: '電子郵件',
		new_password: '新密碼',
		public_profile: '公開資料',
		save_changes: '儲存變更',
		this_will_be: '這將顯示在您的個人資料上',
		update_password: '更新密碼'
	},
	steps: {
		select_department: '选择部门',
		verify_account: '确认款号'
	},
	texts: {
		description: '进入用户和密码跟选择部门与可以登入系统',
		title: '登入系统'
	},
	validation: {
		password_incorrect: '目前密碼不正確',
		password_length: '密碼長度必須至少為 6 個字符',
		require_account: '请登入账户',
		require_company: '请登入公司/工厂',
		require_department: '请登入部门',
		require_password: '请登入密码'
	}
} as const
