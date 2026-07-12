import { useLocalStorageState } from 'ahooks'

export const useInoutboundMethod = () => {
	return useLocalStorageState('inoutboundMethod', {
		defaultValue: 'manually',
		listenStorageChange: true
	})
}
