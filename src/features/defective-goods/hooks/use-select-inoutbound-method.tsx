import { useLocalStorageState } from 'ahooks'
import { DefectiveGoodsCombinationStrategy } from '../types'

export const useInoutboundMethod = () => {
	return useLocalStorageState<DefectiveGoodsCombinationStrategy>('inoutboundMethod', {
		defaultValue: 'manually',
		listenStorageChange: true
	})
}
