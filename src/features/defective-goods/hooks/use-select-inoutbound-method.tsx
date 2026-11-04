import { useLocalStorageState } from 'ahooks'
import { CombinationStrategy } from '../constants/enums'
import { type DefectiveGoodsCombinationStrategy } from '../types'

export const useInoutboundMethod = () => {
	return useLocalStorageState<DefectiveGoodsCombinationStrategy>('inoutboundMethod', {
		defaultValue: CombinationStrategy.MANUALLY,
		listenStorageChange: true
	})
}
