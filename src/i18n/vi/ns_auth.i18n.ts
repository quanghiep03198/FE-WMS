export default {
	actions: {
		go_to_dashboard: 'Đi đến màn hình chính'
	},
	labels: {
		email: 'Email',
		forgot_password: 'Quên mật khẩu?',
		logged_in_with: 'Đã đăng nhập vào',
		password: 'Mật khẩu',
		remember_account: 'Ghi nhớ tài khoản',
		username: 'Tài khoản'
	},
	notification: {
		authenticate_success: 'Đã xác thực tài khoản',
		authenticate_failed: 'Xác thực tài khoản thất bại',
		login_failed: 'Đăng nhập thất bại',
		login_success: 'Đăng nhập thành công',
		logout_failed: 'Đăng xuất thất bại',
		logout_success: 'Đã đăng xuất',
		session_expired: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
	},
	profile: {
		change_password: 'Đổi mật khẩu',
		change_password_to_access: 'Thay đổi mật khẩu để truy cập vào tài khoản của bạn',
		company: 'Công ty',
		current_password: 'Mật khẩu hiện tại',
		display_name: 'Tên hiển thị',
		email: 'Email',
		new_password: 'Mật khẩu mới',
		public_profile: 'Thông tin tài khoản',
		save_changes: 'Lưu thay đổi',
		this_will_be: 'Các thông tin này sẽ được hiển thị trên hồ sơ của bạn',
		update_password: 'Cập nhật mật khẩu'
	},
	steps: {
		select_department: 'Chọn đơn vị công tác',
		verify_account: 'Xác thực tài khoản'
	},
	texts: {
		description: 'Nhập tài khoản, mật khẩu và chọn bộ phận đang công tác để truy cập vào hệ thống',
		title: 'Đăng nhập vào hệ thống',
		qr_code_verification: 'Xác thực mã QR',
		qr_code_verification_description: 'Quét mã QR trên thẻ nhân viên của bạn để xác thực tài khoản.'
	},
	validation: {
		password_incorrect: 'Mật khẩu hiện tại không đúng',
		password_length: 'Mật khẩu phải từ 6 ký tự trở lên',
		require_account: 'Vui lòng nhập tài khoản',
		require_company: 'Vui lòng chọn đơn vị công tác',
		require_password: 'Vui lòng nhập mật khẩu'
	}
} as const
