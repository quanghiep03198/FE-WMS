export default {
	descriptions: {
		daily_weighing_report:
			'Information on inspected and weighed shipments recorded in the electronic weighing system',

		packing_manifest: 'Details of shipments packed and ready for dispatch'
	},

	manifest: {
		create_error: 'Could not start the export.',
		done: 'Export complete',
		download: 'Download Excel',
		expired: 'This export has expired. Please create another.',
		failed: 'Export failed',
		list_error: 'Could not load the packing manifest.',

		pending: 'Queued for export',
		processing: 'Preparing Excel',
		progress: 'Export progress',
		ready: 'The Excel file is ready. Starting the download.',
		retry: 'Retry',
		retry_download: 'Download',
		status_error: 'Could not check the export status.',
		too_many: 'An export is already running. Please wait for it to finish.'
	},
	titles: {
		daily_weighing_report: 'Daily Weighing Report',
		file_daily_weighing_report: 'Packing Weight Report {{factory}} - {{date}}',
		file_packing_manifest: 'Packing Manifest {{factory}}',

		packing_manifest: 'Packing Manifest'
	}
}
