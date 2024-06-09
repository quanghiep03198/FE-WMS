export default {
	labels: {
		email: 'Email',
		username: 'User name',
		password: 'Password',
		remember_account: 'Remember me',
		forgot_password: 'Forgot your password?'
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
		require_department: 'Select department'
	},
	steps: { verify_account: 'Verify your account', select_department: 'Select department' }
} as const
