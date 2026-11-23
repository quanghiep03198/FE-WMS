import { UserRole } from '@common/constants/enums'

export default {
	actions: { go_to_dashboard: 'Go to dashboard' },
	descriptions: {
		create_user: 'Fill in the details below to create a new account.',
		page_description: 'Manage user profiles and assign roles to control system access permissions.',
		update_user: 'Update existing user information and permissions'
	},
	fields: {
		display_name: 'Display name',
		email: 'Email',
		employee_code: 'Employee code',
		joined_system_date: 'Joined system date',
		last_login_at: 'Last login',
		password: 'Password',
		role: 'Role',

		username: 'User name'
	},
	labels: {
		forgot_password: 'Forgot your password?',
		logged_in_with: 'Logged in with',
		remember_account: 'Remember me'
	},
	notification: {
		authenticate_failed: 'Failed to verify your account',
		authenticate_success: 'Verified your account',
		current_password_incorrect: 'Current password is incorrect',
		login_failed: 'Failed to log in',
		login_success: 'Logged in succesfully',
		logout_failed: 'Failed to log out',
		logout_success: 'Logged out',
		session_expired: 'Your session has expired, please log in again',
		viewonly: 'You are currently in view-only mode. Editing access is restricted.'
	},
	profile: {
		change_password: 'Change password',
		change_password_to_access: 'Change password to access to your account',
		company: 'Company',
		current_password: 'Current password',
		display_name: 'Display name',
		email: 'Email',
		new_password: 'New password',
		public_profile: 'Public profile',
		save_changes: 'Save changes',
		this_will_be: 'This will be displayed on your profile',
		update_password: 'Update password'
	},
	roles: {
		[UserRole.ADMIN]: 'Administrator',
		[UserRole.DG_WAREHOUSE_STAFF]: 'Defective Goods Warehouse Staff',
		[UserRole.FG_WAREHOUSE_STAFF]: 'Finished Goods Warehouse Staff',
		[UserRole.IE_STAFF]: 'Import-Export Staff',
		[UserRole.INDUSTRIAL_ENGINEERING_STAFF]: 'IE Staff',

		[UserRole.MANAGER]: 'Manager',
		[UserRole.SECURITY_GUARD]: 'Security Guard'
	},
	steps: { select_department: 'Select department', verify_account: 'Verify your account' },
	texts: {
		description: 'Enter account, password then select department access to the system',
		qr_code_verification: 'QR Code Verification',
		qr_code_verification_description: 'Scan the QR code on your employee card to verify your account.',

		title: 'Sign in to your account'
	},
	titles: {
		create_user: 'Create New User',
		page_title: 'User & Access Management',
		update_user: 'Update Information'
	},
	validation: {
		password_incorrect: 'Current password is incorrect',
		password_length: 'Password must be at least 6 characters long',
		require_account: 'Enter your account',
		require_company: 'Select company/factory',
		require_department: 'Select department',
		require_password: 'Enter your password'
	}
} as const
