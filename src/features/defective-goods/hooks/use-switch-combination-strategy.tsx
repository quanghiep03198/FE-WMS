import { useLocalStorageState } from 'ahooks'

export const useSwitchCombinationStrategy = () => {
	const [currentStrategy, setStrategy] = useLocalStorageState<'usb' | 'uhf' | 'manually'>('epcCombinationStrategy', {
		listenStorageChange: true,
		defaultValue: 'uhf'
	})

	return { currentStrategy, setStrategy }
}
