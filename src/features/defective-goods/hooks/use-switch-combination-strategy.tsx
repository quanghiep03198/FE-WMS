import { useLocalStorageState } from 'ahooks'
import { CombinationStrategy } from '../constants/enums'
import type { DefectiveGoodsCombinationStrategy } from '../types'

export const useSwitchCombinationStrategy = () => {
	const [currentStrategy, setStrategy] = useLocalStorageState<Nullish<DefectiveGoodsCombinationStrategy>>(
		'epcCombinationStrategy',
		{
			listenStorageChange: true,
			defaultValue: CombinationStrategy.UHF
		}
	)

	return { currentStrategy, setStrategy }
}
