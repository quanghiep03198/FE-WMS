export default {
	settings: {
		language: 'Language',
		theme: 'Theme',
		function: 'Function',
		font: 'Font'
	},
	specialized_vocabs: {
		warehouse: 'Warehouse',
		storage_area: 'Storage area'
	},
	common_fields: {
		created_at: 'Created at',
		updated_at: 'Updated at',
		user_name_updated: 'Last updated by',
		actions: 'Actions',
		remark: 'Remark',
		approver: 'Approver',
		approver_time: 'Approval time',
		total: 'Total'
	},
	actions: {
		add: 'Add',
		update: 'Update',
		delete: 'Delete',
		save: 'Save',
		save_changes: 'Save changes',
		revert_changes: 'Revert changes',
		cancel: 'Cancel',
		submit: 'Submit',
		proceed: 'Proceed',
		start: 'Start',
		confirm: 'Confirm',
		continue: 'Continue',
		stop: 'Stop',
		reset: 'Reset',
		finish: 'Finish',
		back: 'Back',
		open: 'Open',
		close: 'Close',
		login: 'Log in',
		logout: 'Log out',
		search: 'Search',
		reload: 'Reload',
		detail: 'Detail',
		clear_filter: 'Clear filters',
		toggle_sidebar: 'Toggle Primary Side Bar',
		toggle_theme: 'Toggle Theme',
		set_approval_status: 'Set approval status',
		approve: 'Approve',
		reapprove: 'Reapprove',
		cancel_approve: 'Cancel Approval'
	},
	table: {
		selected_rows: '{{selectedRows}} row(s) selected',
		page: 'Page {{page}}',
		rows_per_page: 'Rows per page',
		filter: 'Filter',
		no_filter_applied: 'No filter is applied',
		no_data: 'No data',
		search_in_column: 'Search in column',
		no_match_result: 'No results found.'
	},
	form_placeholder: {
		select: '-- Select {{object}} --',
		fill: 'Fill in {{object}}...',
		search: 'Search by {{object}} ...'
	},
	pagination: {
		next_page: 'Next page',
		previous_page: 'Previous page',
		first_page: 'First page',
		last_page: 'Last page'
	},
	navigation: {
		settings: 'Settings',
		appearance: 'Appearance',
		profile: 'Profile',
		account: 'Account',
		keyboard_shortcut: 'Keyboard shortcut',
		dashboard: 'Dashboard',
		inoutbound_commands: 'Import/Export commands',
		warehouse_management: 'Warehouse management',
		storage_detail: 'Storage details',
		import_management: 'Import management',
		export_management: 'Export management',
		transfer_managment: 'Transfer management',
		inventory_management: 'Inventory',
		production_incoming_inspection: 'Product Incoming Inspection',
		report_management: 'Report'
	},
	notification: {
		processing_request: 'Processing request ...',
		success: 'Successfully !',
		error: 'Something went wrong !'
	},
	confirmation: {
		delete_title: 'Delete selected record(s)',
		delete_description:
			'Are you sure you want to delete the selected record(s)? The data will be irrecoverable. This action cannot be undone.'
	},
	errors: {
		'404': 'Page Not Found',
		'404_message': 'The page you are looking for does not exist.',
		'403': 'Permission Denied',
		'403_message': "You don't have permission to access this page.",
		'503': 'Service Unavailable',
		'503_message': 'This feature is currently under development/maintenance. Please try again later.'
	},
	common_form_titles: {
		create: 'Create new {{object}}',
		update: 'Update {{object}}'
	},
	status: {
		stopped: 'Stopped'
	}
} as const
