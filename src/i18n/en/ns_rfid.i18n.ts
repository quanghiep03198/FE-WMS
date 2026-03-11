export default {
	no_sync_process: 'No synchronization process is running',
	use_rfid_device: 'Use handheld device',
	recently_use: 'Recently use',
	fields: {
		device_sn: 'Device serial number',
		device_name: 'Device name',
		device_type: 'Device type',
		station_no: 'Station NO',
		last_used_time: 'Last used time'
	},
	titles: {
		add_device: 'Add device',
		edit_device: 'Edit device info',
		rfid_device_management: 'RFID device management'
	},
	descriptions: {
		rfid_device_management: 'Manage RFID devices used in the warehouse.',
		dialog_form: 'Please fill in the information below to add or update RFID device information to the system.',
		device_sn: 'The serial number is usually found on a sticker on the back of the device.',
		device_name: 'A unique name to identify the station in the production system.',
		device_type: 'Select device type to configure the appropriate settings.'
	},
	placeholders: {
		search_epc: 'Scan or type EPC to search ...'
	},
	sync_data_steps: {
		step_1: "Authenticate Deckers's API",
		step_2: "Fetch Deckers's orders and EPC data",
		step_3: 'Update EPC data',
		step_4: 'Complete job'
	},
	status: {
		scannable: 'Scannable',
		scanned: 'Scanned',
		unscannable: 'Unscannable',
		unscanned: 'Unscanned'
	},
	rfid_agent_connection_failure: {
		title: 'Cannot connect to RFID Agent',
		description:
			'Please ensure that your computer has the RFID Agent installed and running, and that all RFID device settings are correct.'
	},
	reader_settings_form: {
		title: 'RFID Reader Settings',
		description: `You can specify the reader's network details, such as its IP address, to ensure proper connectivity and functionality.`,
		reader_ip: {
			label: 'Reader IP',
			description:
				'Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 (type A) address.'
		},
		reader_ant: {
			label: 'Antenna',
			description: 'Select the antenna number to be used for reading RFID tags.'
		},
		reader_power: {
			label: 'Reader power',
			description:
				'Adjust the power level of the RFID reader (5-30 dBm). Higher power levels may increase read range but can also lead to interference.'
		},
		sync_settings: {
			title: 'Sync settings',
			description: 'Clicking the "Sync settings" button will fetch the latest settings from the RFID reader device.'
		}
	}
}
