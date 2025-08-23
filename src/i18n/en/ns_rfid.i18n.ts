export default {
	devices: 'RFID Devices',
	devices_description: 'List of RFID devices currently available in the warehouse',
	no_sync_process: 'No synchronization process is running',
	use_rfid_device: 'Use handheld device',
	sync_data_steps: {
		step_1: "Authenticate Decker's API",
		step_2: "Fetch Decker's orders and EPC data",
		step_3: 'Update EPC data',
		step_4: 'Complete Job'
	},
	status: {
		scannable: 'Scannable',
		scanned: 'Scanned',
		unscannable: 'Unscannable',
		unscanned: 'Unscanned'
	}
}
