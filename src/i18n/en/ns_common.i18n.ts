export default {
	settings: {
		language: 'Language',
		theme: 'Theme',
		function: 'Function'
	},
	specialized_vocabs: {
		warehouse: 'Warehouse',
		storage_area: 'Storage area'
	},
	common_fields: {
		created_at: 'Created at',
		updated_at: 'Updated at',
		actions: 'Actions',
		remark: 'Remark'
	},
	actions: {
		add: 'Add',
		update: 'Update',
		delete: 'Delete',
		save: 'Save',
		cancel: 'Cancel',
		submit: 'Submit',
		confirm: 'Confirm',
		continue: 'Continue',
		back: 'Back',
		close: ' Close',
		login: 'Log in',
		logout: 'Log out',
		search: 'Search',
		detail: 'Detail',
		clear_filter: 'Clear filters',
		toggle_sidebar: 'Toggle Primary Side Bar',
		toggle_theme: 'Toggle Theme'
	},
	table: {
		selected_rows: '{{selectedRows}} row(s) selected',
		page: 'Page {{page}}',
		display: 'Display',
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
		in_out_commands: 'Import/Export commands',
		warehouse_commands: 'Warehouse management',
		storage_detail: 'Storage details',
		import_management: 'Import management',
		export_management: 'Export management',
		transfer_managment: 'Transfer management',
		inventory_management: 'Inventory',
		receiving_checking_management: 'Product Incoming Inspection',
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
	}
} as const
