export default {
	descriptions: {
		deduplicate_epc: 'Prevent duplicate scanning of EPCs that have been saved in the system before.',
		device_name: 'A unique name to identify the station in the production system.',
		device_sn: 'The serial number is usually found on a sticker on the back of the device.',
		device_type: 'Select device type to configure the appropriate settings.',

		dialog_form: 'Please fill in the information below to add or update RFID device information to the system.',
		rfid_device_management: 'Manage RFID devices used in the warehouse.'
	},
	fields: {
		device_name: 'Device name',
		device_sn: 'Device serial number',
		device_type: 'Device type',
		last_used_time: 'Last used time',

		station_no: 'Station NO'
	},
	no_sync_process: 'No synchronization process is running',
	placeholders: {
		search_epc: 'Scan or type EPC to search ...'
	},
	reader_settings_form: {
		description: `You can specify the reader's network details, such as its IP address, to ensure proper connectivity and functionality.`,
		reader_ant: {
			description: 'Select the antenna number to be used for reading RFID tags.',

			label: 'Antenna'
		},
		reader_ip: {
			description:
				'Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 (type A) address.',

			label: 'Reader IP'
		},
		reader_power: {
			description:
				'Adjust the power level of the RFID reader (5-30 dBm). Higher power levels may increase read range but can also lead to interference.',

			label: 'Reader power'
		},
		sync_settings: {
			description: 'Clicking the "Sync settings" button will fetch the latest settings from the RFID reader device.',

			title: 'Sync settings'
		},

		title: 'RFID Reader Settings'
	},

	recently_use: 'Recently use',
	rfid_agent_connection_failure: {
		description:
			'Please ensure that your computer has the RFID Agent installed and running, and that all RFID device settings are correct.',

		title: 'Cannot connect to RFID Agent'
	},
	status: {
		scannable: 'Scannable',
		scanned: 'Scanned',
		unscannable: 'Unscannable',
		unscanned: 'Unscanned'
	},
	sync_data_steps: {
		step_1: "Authenticate Deckers's API",
		step_2: "Fetch Deckers's orders and EPC data",
		step_3: 'Update EPC data',
		step_4: 'Complete job'
	},
	titles: {
		add_device: 'Add device',
		deduplicate_epc: 'Deduplicate EPC',
		edit_device: 'Edit device info',
		rfid_device_management: 'RFID device management',
		watching: 'Watching'
	},
	use_rfid_device: 'Use handheld device'
}
