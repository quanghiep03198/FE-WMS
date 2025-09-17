export default {
	devices: 'RFID Devices',
	devices_description: 'List of RFID devices currently available in the warehouse',
	no_sync_process: 'No synchronization process is running',
	use_rfid_device: 'Use handheld device',
	placeholders: {
		search_epc: 'Scan or type EPC to search ...'
	},
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
