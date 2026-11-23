import { UserRole } from '@common/constants/enums'

export default {
	actions: { go_to_dashboard: 'ទៅកាន់ផ្ទាំងគ្រប់គ្រង' },
	descriptions: {
		create_user: 'បំពេញព័ត៌មានខាងក្រោម ដើម្បីបង្កើតគណនីថ្មី។',
		page_description: 'គ្រប់គ្រងប្រវត្តិរូបអ្នកប្រើ និងកំណត់តួនាទី ដើម្បីគ្រប់គ្រងសិទ្ធិចូលប្រើប្រព័ន្ធ។',
		update_user: 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មាន និងសិទ្ធិរបស់អ្នកប្រើដែលមានស្រាប់។'
	},
	fields: {
		display_name: 'ឈ្មោះបង្ហាញ',
		email: 'អ៊ីមែល',
		employee_code: 'លេខកូដបុគ្គលិក',
		joined_system_date: 'កាលបរិច្ឆេទចូលប្រើប្រព័ន្ធ',
		last_login_at: 'ការចូលប្រើចុងក្រោយ',
		password: 'ពាក្យសម្ងាត់',
		role: 'តួនាទី',
		username: 'ឈ្មោះអ្នកប្រើ'
	},
	labels: {
		forgot_password: 'ភ្លេចពាក្យសម្ងាត់មែនទេ?',
		logged_in_with: 'បានចូលដោយប្រើ',
		remember_account: 'ចងចាំខ្ញុំ'
	},
	notification: {
		authenticate_failed: 'មិនអាចផ្ទៀងផ្ទាត់គណនីរបស់អ្នកបានទេ',
		authenticate_success: 'បានផ្ទៀងផ្ទាត់គណនីរបស់អ្នក',
		current_password_incorrect: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ',
		login_failed: 'មិនអាចចូលបានទេ',
		login_success: 'បានចូលដោយជោគជ័យ',
		logout_failed: 'មិនអាចចាកចេញបានទេ',
		logout_success: 'បានចាកចេញ',
		session_expired: 'សម័យប្រើប្រាស់របស់អ្នកបានផុតកំណត់ សូមចូលម្តងទៀត',
		viewonly: 'បច្ចុប្បន្នអ្នកកំពុងប្រើទម្រង់មើលតែប៉ុណ្ណោះ។ មិនអាចកែប្រែបានទេ។'
	},
	profile: {
		change_password: 'ប្តូរពាក្យសម្ងាត់',
		change_password_to_access: 'ប្តូរពាក្យសម្ងាត់ ដើម្បីចូលប្រើគណនីរបស់អ្នក',
		company: 'ក្រុមហ៊ុន',
		current_password: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
		display_name: 'ឈ្មោះបង្ហាញ',
		email: 'អ៊ីមែល',
		new_password: 'ពាក្យសម្ងាត់ថ្មី',
		public_profile: 'ប្រវត្តិរូបសាធារណៈ',
		save_changes: 'រក្សាទុកការផ្លាស់ប្តូរ',
		this_will_be: 'ព័ត៌មាននេះនឹងបង្ហាញនៅលើប្រវត្តិរូបរបស់អ្នក',
		update_password: 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់'
	},
	roles: {
		[UserRole.ADMIN]: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ',
		[UserRole.DG_WAREHOUSE_STAFF]: 'បុគ្គលិកឃ្លាំងទំនិញខូច',
		[UserRole.FG_WAREHOUSE_STAFF]: 'បុគ្គលិកឃ្លាំងទំនិញសម្រេច',
		[UserRole.IE_STAFF]: 'បុគ្គលិកនាំចូល-នាំចេញ',
		[UserRole.INDUSTRIAL_ENGINEERING_STAFF]: 'បុគ្គលិកវិស្វកម្មឧស្សាហកម្ម',
		[UserRole.MANAGER]: 'អ្នកគ្រប់គ្រង',
		[UserRole.SECURITY_GUARD]: 'សន្តិសុខ'
	},
	steps: { select_department: 'ជ្រើសរើសផ្នែក', verify_account: 'ផ្ទៀងផ្ទាត់គណនីរបស់អ្នក' },
	texts: {
		description: 'បញ្ចូលគណនី និងពាក្យសម្ងាត់ រួចជ្រើសរើសផ្នែក ដើម្បីចូលប្រើប្រព័ន្ធ',
		qr_code_verification: 'ការផ្ទៀងផ្ទាត់កូដ QR',
		qr_code_verification_description: 'ស្កេនកូដ QR នៅលើកាតបុគ្គលិករបស់អ្នក ដើម្បីផ្ទៀងផ្ទាត់គណនី។',
		title: 'ចូលគណនីរបស់អ្នក'
	},
	titles: {
		create_user: 'បង្កើតអ្នកប្រើថ្មី',
		page_title: 'ការគ្រប់គ្រងអ្នកប្រើ និងសិទ្ធិចូលប្រើ',
		update_user: 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មាន'
	},
	validation: {
		password_incorrect: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ',
		password_length: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ',
		require_account: 'សូមបញ្ចូលគណនីរបស់អ្នក',
		require_company: 'សូមជ្រើសរើសក្រុមហ៊ុន/រោងចក្រ',
		require_department: 'សូមជ្រើសរើសផ្នែក',
		require_password: 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក'
	}
} as const
