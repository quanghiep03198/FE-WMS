export default {
	actions: {
		add: 'Add',
		adjust: 'Adjust',
		approve: 'Approve',
		back: 'Back',
		cancel: 'Cancel',
		cancel_approve: 'Cancel Approval',
		clear_filter: 'Clear filters',
		close: 'Close',
		confirm: 'Confirm',
		connect: 'Connect',
		continue: 'Continue',
		delete: 'Delete',
		detail: 'Detail',
		disconnect: 'Disconnect',
		dismiss: 'Dismiss',
		export: 'Export',
		finish: 'Finish',
		load_more: 'Load more',
		login: 'Log in',
		logout: 'Log out',
		open: 'Open',
		proceed: 'Proceed',
		reapprove: 'Reapprove',
		reload: 'Reload',
		reset: 'Reset',
		retry: 'Retry',
		revert_changes: 'Revert changes',
		save: 'Save',
		save_changes: 'Save changes',
		search: 'Search',
		set_approval_status: 'Set approval status',
		start: 'Start',
		stop: 'Stop',
		submit: 'Submit',
		toggle_sidebar: 'Toggle Primary Side Bar',
		toggle_theme: 'Toggle Theme',
		update: 'Update'
	},
	common_fields: {
		actions: 'Actions',
		approver: 'Approver',
		approver_time: 'Approval time',
		created_at: 'Created at',
		quantity: 'Quantity',
		remark: 'Remark',
		status: 'Status',
		total: 'Total',
		updated_at: 'Updated at',
		user_name_updated: 'Last updated by'
	},
	common_form_titles: {
		create: 'Create new {{object}}',
		update: 'Update {{object}}'
	},
	confirmation: {
		delete_description:
			'Are you sure you want to delete the selected record(s)? The data will be irrecoverable. This action cannot be undone.',
		delete_title: 'Delete selected record(s)',
		understand_and_proceed: 'I understand and want to proceed'
	},
	errors: {
		'403': 'Permission Denied',
		'403_message': "You don't have permission to access this page.",
		'404': 'Page Not Found',
		'404_message': 'The page you are looking for does not exist.',
		'503': 'Service Unavailable',
		'503_message': 'This feature is currently under development/maintenance. Please try again later.'
	},
	form_placeholder: {
		fill: 'Fill in {{object}}...',
		search: 'Search by {{object}} ...',
		select: '-- Select {{object}} --'
	},
	navigation: {
		account: 'Account',
		appearance: 'Appearance',
		dashboard: 'Dashboard',
		export_management: 'Export management',
		fm_inoutbound: 'F.P warehouse inoutbound',
		import_management: 'Import management',
		inventory_management: 'Inventory',
		keyboard_shortcut: 'Keyboard shortcut',
		pm_inbound: 'P.M warehouse inbound',
		production_incoming_inspection: 'Product Incoming Inspection',
		profile: 'Profile',
		report_management: 'Report',
		settings: 'Settings',
		storage_detail: 'Storage details',
		transfer_managment: 'Transfer management',
		warehouse_management: 'Warehouse management'
	},
	notification: {
		downloading: 'Downloading ...',
		establish_connection: 'Establishing connection ...',
		error: 'Something went wrong !',
		processing_request: 'Processing request ...',
		success: 'Successfully !'
	},
	pagination: {
		first_page: 'First page',
		last_page: 'Last page',
		next_page: 'Next page',
		previous_page: 'Previous page'
	},
	settings: {
		font: 'Font',
		function: 'Function',
		language: 'Language',
		theme: 'Theme'
	},
	status: {
		connected: 'Connected',
		connecting: 'Connnecting',
		disconnected: 'Disconnected',
		idle: 'Idle',
		loading: 'Loading ...',
		processing: 'Processing ...',
		running: 'Running'
	},
	table: {
		filter: 'Filter',
		no_data: 'No data',
		no_filter_applied: 'No filter is applied',
		no_match_result: 'No results found.',
		page: 'Page {{page}}',
		problem_arises: 'Problem arises',
		rows_per_page: 'Rows per page',
		search_in_column: 'Search in column',
		selected_rows: '{{selectedRows}} row(s) selected'
	},
	titles: {
		caution: 'Caution',
		general_settings: 'General settings'
	},
	others: {
		server: 'Server {{alias}}'
	}
} as const
