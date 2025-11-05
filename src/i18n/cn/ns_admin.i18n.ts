export default {
	title: '管理员页面',
	description: '系统管理页面&访问权限管理.',
	user_management: {
		user_code: '账号',
		employee_code: '工号',
		employee_name: '员工姓名',
		password: '密码',
		role: '职位',
		email: '邮箱',
		department: '部门',
		sex: '性别',
		dob: '出生日期'
	},
	permission_management: {
		permission_name: '权限',
		parent_name: '原始权限',
		parent_id: '原始权限编码'
	}
} as const
