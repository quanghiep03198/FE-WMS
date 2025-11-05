export default {
	title: 'Trang quản trị',
	description: 'Trang quản trị hệ thống và quản lý quyền truy cập.',
	user_management: {
		user_code: 'Tài khoản',
		employee_code: 'Mã nhân viên',
		employee_name: 'Tên nhân viên',
		password: 'Mật khẩu',
		role: 'Chức vụ',
		email: 'Email',
		department: 'Bộ phận',
		sex: 'Giới tính',
		dob: 'Ngày sinh'
	},
	permission_management: {
		permission_name: 'Quyền hạn',
		parent_name: 'Quyền hạn gốc',
		parent_id: 'Mã quyền hạn gốc'
	}
} as const
