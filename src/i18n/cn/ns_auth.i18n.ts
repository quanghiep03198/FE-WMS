import { UserRole } from '@/common/constants/enums'

export default {
	actions: {
		go_to_dashboard: '转回主页'
	},
	descriptions: {
		access_management: '管理用户和系统访问权限'
	},
	fields: {
		email: 'Email',
		display_name: '显示名称',
		password: '密码',
		username: '用户名',
		employee_code: '员工编号',
		last_login_at: '最后登录时间',
		role: '角色'
	},
	labels: {
		forgot_password: '忘记密码?',
		logged_in_with: '已登入',
		remember_account: '记住我'
	},
	notification: {
		authenticate_success: '确认登录成功',
		authenticate_failed: '确认登录失败',
		login_failed: '登入失败',
		login_success: '登入成功',
		logout_failed: '登出失败',
		logout_success: '登出',
		session_expired: '您的会话已过期，请重新登录'
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
	roles: {
		[UserRole.ADMIN]: '系统管理员',
		[UserRole.MANAGER]: '经理',
		[UserRole.FG_WAREHOUSE_STAFF]: '成品仓库员工',
		[UserRole.DG_WAREHOUSE_STAFF]: 'B级鞋仓库员工',
		[UserRole.IE_STAFF]: '进出口员工',
		[UserRole.SECURITY_GUARD]: '保卫'
	},
	steps: {
		select_department: '选择部门',
		verify_account: '确认款号'
	},
	texts: {
		description: '进入用户和密码跟选择部门与可以登入系统',
		title: '登入系统',
		qr_code_verification: 'QR 码确认',
		qr_code_verification_description: '扫描您员工卡上的 QR 码以确认您的帐户.'
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
