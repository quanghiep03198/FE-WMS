import { useLocalStorageState } from 'ahooks'
import { DefectiveGoodsCombinationStrategy } from '../types'

export const useSwitchCombinationStrategy = () => {
	const [currentStrategy, setStrategy] = useLocalStorageState<Nullish<DefectiveGoodsCombinationStrategy>>(
		'epcCombinationStrategy',
		{
			listenStorageChange: true,
			defaultValue: 'uhf'
		}
	)

	return { currentStrategy, setStrategy }
}
