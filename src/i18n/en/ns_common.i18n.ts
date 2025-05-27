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
		csv_upload: 'Click to upload or drag and drop CSV files',
		decrement: 'Decrement',
		delete: 'Delete',
		detail: 'Detail',
		disconnect: 'Disconnect',
		dismiss: 'Dismiss',
		export: 'Export',
		finish: 'Finish',
		fold: 'Fold',
		increment: 'Increment',
		load_more: 'Load more',
		login: 'Log in',
		logout: 'Log out',
		open: 'Open',
		pin: 'Pin',
		proceed: 'Proceed',
		reapprove: 'Reapprove',
		reload: 'Reload',
		report_bug: 'Report bug',
		reset: 'Reset',
		retry: 'Retry',
		revert_changes: 'Revert changes',
		save: 'Save',
		save_changes: 'Save changes',
		search: 'Search',
		select_database: 'Select database',
		select_server: 'Select server',
		set_approval_status: 'Set approval status',
		start: 'Start',
		stop: 'Stop',
		submit: 'Submit',
		toggle_sidebar: 'Toggle Primary Side Bar',
		toggle_theme: 'Toggle Theme',
		trigger: 'Trigger',
		unpin_all_columns: 'Unpin all columns',
		update: 'Update',
		upload: 'Upload'
	},
	common_fields: {
		actions: 'Actions',
		approver: 'Approver',
		approver_time: 'Approval time',
		created_at: 'Created at',
		factory_code: 'Factory code',
		quantity: 'Quantity',
		quantity_with_limit: 'Quantity (max {{limit}})',
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
	descriptions: {
		import_data: 'Upload a CSV files to import data. The uploaded files must be in the correct format.',
		chosen_files: 'Chose {{qty}} files'
	},
	errors: {
		'403': 'Permission Denied',
		'403_message': "You don't have permission to access this page.",
		'404': 'Page Not Found',
		'404_message': 'The page you are looking for does not exist.',
		'500': 'Something went wrong',
		'500_message':
			'We are so sorry about this inconvenience. You can retry previous action again, if it does not work, please send us a feedback to describe whar error that you have been encountered. We will try to fix it as soon as possible.',
		'501': 'Not Implemented',
		'501_message': 'Please access {{url}} to use this feature for factory {{factoryCode}}',
		'503': 'Service Unavailable',
		'503_message': 'This feature is currently under development/maintenance. Please try again later.'
	},
	factory: {
		VA1: 'Lian Ying',
		VB1: 'Lian Shun 1',
		VB2: 'Lian Shun 2',
		CA1: 'KHRU'
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
		fp_inoutbound: 'F.P warehouse inoutbound',
		fp_stock_out: 'F.P stock out',
		import_management: 'Import management',
		inventory_management: 'Inventory',
		keyboard_shortcut: 'Keyboard shortcut',
		pm_inbound: 'P.M warehouse inbound',
		cargo_weight_check: 'Cargo weight check',
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
		success: 'Successfully !',
		receiving_data: 'Waiting for data ...'
	},
	pagination: {
		ellipsis_count: '... and {{count}} more items',
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
		active: 'Active',
		connected: 'Connected',
		connecting: 'Connnecting',
		deactivated: 'Deactivated',
		disconnected: 'Disconnected',
		idle: 'Idle',
		loading: 'Loading ...',
		processing: 'Processing ...',
		running: 'Running'
	},
	table: {
		auto_refresh: 'Auto refresh',
		clear_sort: 'Clear sort',
		filter: 'Filter',
		hide_column: 'Hide this column',
		no_data: 'No data',
		no_filter_applied: 'No filter is applied',
		no_match_result: 'No results found.',
		page: 'Page {{page}}',
		pin_left: 'Pin left',
		pin_right: 'Pin right',
		refetch_interval: 'Refetch interval (s)',
		reset_size: 'Reset size',
		rows_per_page: 'Rows per page',
		search_in_column: 'Search in column',
		selected_rows: '{{selectedRows}} row(s) selected',
		sort_asc: 'Sort ascending',
		sort_desc: 'Sort descending',
		total_rows: '{{count}} records',
		unpin: 'Unpin'
	},
	titles: {
		caution: 'Caution',
		general_settings: 'General settings',
		import_data: 'Import data',
		original_data: 'Original data',
		overall: 'Overall',
		target_data: 'Target data'
	},
	others: {
		server: 'Server {{alias}}'
	}
} as const
