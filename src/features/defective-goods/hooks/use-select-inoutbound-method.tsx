import { useLocalStorageState } from 'ahooks'
import { CombinationStrategy } from '../constants/enums'

export const useInoutboundMethod = () => {
	return useLocalStorageState<CombinationStrategy>('inoutboundMethod', {
		defaultValue: CombinationStrategy.MANUALLY,
		listenStorageChange: true
	})
}
