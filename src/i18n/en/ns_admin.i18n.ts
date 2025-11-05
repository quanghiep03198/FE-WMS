export default {
	title: 'Admin Dashboard',
	description: 'System administration page and access control management.',
	user_management: {
		user_code: 'Username',
		employee_code: 'Employee Code',
		employee_name: 'Employee Name',
		password: 'Password',
		role: 'Role',
		email: 'Email',
		department: 'Department',
		sex: 'Gender',
		dob: 'Date of Birth'
	},
	permission_management: {
		permission_name: 'Permission Name',
		parent_name: 'Parent Permission',
		parent_id: 'Parent Permission ID'
	}
} as const
