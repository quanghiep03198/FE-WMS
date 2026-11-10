import { useLocalStorageState } from 'ahooks'
import { CombinationStrategy } from '../constants/enums'

export const useSwitchCombinationStrategy = () => {
	const [currentStrategy, setStrategy] = useLocalStorageState<Nullish<CombinationStrategy>>('epcCombinationStrategy', {
		listenStorageChange: true,
		defaultValue: CombinationStrategy.UHF
	})

	return { currentStrategy, setStrategy }
}
