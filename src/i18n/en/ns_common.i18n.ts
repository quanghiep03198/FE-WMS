export default {
	language: 'Language',
	theme: 'Theme',
	function: 'Function',
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
		wh_dashboard: 'Dashboard',
		wh_inbound_outbound: 'Import/Export commands',
		wh_management: 'Warehouse management',
		wh_import_management: 'Import management',
		wh_export_management: 'Export management',
		wh_transfer_managment: 'Transfer management',
		wh_inventory_management: 'Inventory',
		wh_receiving_checking_management: 'Receiving checking management',
		wh_report_management: 'Report'
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
	}
} as const
