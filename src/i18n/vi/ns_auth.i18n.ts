export default {
	labels: {
		email: 'Email',
		username: 'Tài khoản',
		password: 'Mật khẩu',
		remember_account: 'Ghi nhớ tài khoản',
		forgot_password: 'Quên mật khẩu?',
		logged_in_with: 'Đã đăng nhập vào'
	},
	texts: {
		title: 'Đăng nhập vào hệ thống',
		description: 'Nhập tài khoản, mật khẩu và chọn bộ phận đang công tác để truy cập vào hệ thống'
	},
	notification: {
		authenticate_success: 'Đã xác thực tài khoản',
		login_success: 'Đăng nhập thành công',
		logout_success: 'Đã đăng xuất',
		login_failed: 'Đăng nhập thất bại',
		logout_failed: 'Đăng xuất thất bại'
	},
	actions: {
		go_to_dashboard: 'Đi đến màn hình chính'
	},
	validation: {
		require_account: 'Vui lòng nhập tài khoản',
		require_password: 'Vui lòng nhập mật khẩu',
		require_company: 'Vui lòng chọn đơn vị công tác',
		password_length: 'Mật khẩu phải từ 6 ký tự trở lên',
		password_incorrect: 'Mật khẩu hiện tại không đúng'
	},
	profile: {
		update_password: 'Cập nhật mật khẩu',
		change_password_to_access: 'Thay đổi mật khẩu để truy cập vào tài khoản của bạn',
		current_password: 'Mật khẩu hiện tại',
		new_password: 'Mật khẩu mới',
		change_password: 'Đổi mật khẩu',
		public_profile: 'Thông tin tài khoản',
		this_will_be: 'Các thông tin này sẽ được hiển thị trên hồ sơ của bạn',
		display_name: 'Tên hiển thị',
		company: 'Công ty',
		email: 'Email',
		save_changes: 'Lưu thay đổi'
	},
	steps: {
		verify_account: 'Xác thực tài khoản',
		select_department: 'Chọn đơn vị công tác'
	}
} as const
