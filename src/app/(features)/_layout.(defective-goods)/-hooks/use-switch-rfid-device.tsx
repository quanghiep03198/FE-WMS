import { useLocalStorageState } from 'ahooks'

export const useSwitchRFIDDevice = () => {
	const [currentDevice, setCurrentDevice] = useLocalStorageState<'usb' | 'uhf'>('epcCombinationPlaygroundDevice', {
		listenStorageChange: true,
		defaultValue: 'uhf'
	})

	return { currentDevice, setCurrentDevice }
}
