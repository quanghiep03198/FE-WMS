export default {
	labels: {
		email: 'Email',
		username: 'User name',
		password: 'Password',
		remember_account: 'Remember me',
		forgot_password: 'Forgot your password?',
		logged_in_with: 'Logged in with'
	},
	texts: {
		title: 'Sign in to your account',
		description: 'Enter account, password then select department access to the system'
	},
	notification: {
		authenticate_success: 'Verified your account',
		login_success: 'Logged in succesfully',
		logout_success: 'Logged out',
		login_failed: 'Failed to log in',
		logout_failed: 'Failed to log out'
	},
	actions: { go_to_dashboard: 'Go to dashboard' },
	validation: {
		require_account: 'Enter your account',
		require_password: 'Enter your password',
		require_company: 'Select company/factory',
		require_department: 'Select department',
		password_length: 'Password must be at least 6 characters long',
		password_incorrect: 'Current password is incorrect'
	},
	profile: {
		update_password: 'Update password',
		change_password_to_access: 'Change password to access to your account',
		current_password: 'Current password',
		new_password: 'New password',
		change_password: 'Change password',
		public_profile: 'Public profile',
		this_will_be: 'This will be displayed on your profile',
		display_name: 'Display name',
		company: 'Company',
		email: 'Email',
		save_changes: 'Save changes'
	},
	steps: { verify_account: 'Verify your account', select_department: 'Select department' }
} as const
