import { useLocalStorageState } from 'ahooks'

export const useSwitchCombinationStrategy = () => {
	const [currentStrategy, setStrategy] = useLocalStorageState<Nullish<'usb' | 'uhf' | 'manually'>>(
		'epcCombinationStrategy',
		{
			listenStorageChange: true,
			defaultValue: 'uhf'
		}
	)

	return { currentStrategy, setStrategy }
}
