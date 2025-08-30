import { useLocalStorageState } from 'ahooks'

export const useSwitchRFIDDevice = () => {
	const [currentDevice, setCurrentDevice] = useLocalStorageState<'usb' | 'uhf'>('def_rfid_device', {
		listenStorageChange: true,
		defaultValue: 'uhf'
	})

	return { currentDevice, setCurrentDevice }
}
