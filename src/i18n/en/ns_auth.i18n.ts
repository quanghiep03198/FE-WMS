export default {
	actions: { go_to_dashboard: 'Go to dashboard' },
	labels: {
		email: 'Email',
		forgot_password: 'Forgot your password?',
		logged_in_with: 'Logged in with',
		password: 'Password',
		remember_account: 'Remember me',
		username: 'User name'
	},
	notification: {
		authenticate_success: 'Verified your account',
		login_failed: 'Failed to log in',
		login_success: 'Logged in succesfully',
		logout_failed: 'Failed to log out',
		logout_success: 'Logged out'
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
	steps: { select_department: 'Select department', verify_account: 'Verify your account' },
	texts: {
		description: 'Enter account, password then select department access to the system',
		title: 'Sign in to your account'
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
