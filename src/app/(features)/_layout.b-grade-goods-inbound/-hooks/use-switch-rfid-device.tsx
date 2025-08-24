import { useLocalStorageState } from 'ahooks'

export const useSwitchRFIDDevice = () => {
	const [currentDevice, setCurrentDevice] = useLocalStorageState<'usb' | 'android'>('def_rfid_device', {
		listenStorageChange: true,
		defaultValue: 'usb'
	})

	return { currentDevice, setCurrentDevice }
}
