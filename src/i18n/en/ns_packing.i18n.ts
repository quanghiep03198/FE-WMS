export default {
	manifest: {
		pending: 'Queued for export',
		processing: 'Preparing Excel',
		done: 'Export complete',
		ready: 'The Excel file is ready. Starting the download.',
		retry_download: 'Download',
		failed: 'Export failed',
		expired: 'This export has expired. Please create another.',
		progress: 'Export progress',
		download: 'Download Excel',
		too_many: 'An export is already running. Please wait for it to finish.',
		create_error: 'Could not start the export.',
		status_error: 'Could not check the export status.',
		retry: 'Retry',
		list_error: 'Could not load the packing manifest.'
	},
	titles: {
		packing_manifest: 'Packing Manifest',
		daily_weighing_report: 'Daily Weighing Report',
		file_daily_weighing_report: 'Packing Weight Report {{factory}} - {{date}}',
		file_packing_manifest: 'Packing Manifest {{factory}}'
	},
	descriptions: {
		packing_manifest: 'Details of shipments packed and ready for dispatch',
		daily_weighing_report: 'Information on inspected and weighed shipments recorded in the electronic weighing system'
	}
}
