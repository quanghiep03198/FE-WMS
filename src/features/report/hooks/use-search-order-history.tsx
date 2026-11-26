import { useLocalStorageState } from 'ahooks'

export const useSearchOrderHistory = () => {
	return useLocalStorageState<{
		inbound: string[]
		outbound: string[]
	}>('recentOrderSearchHistory', {
		listenStorageChange: true,
		defaultValue: {
			inbound: [],
			outbound: []
		}
	})
}
