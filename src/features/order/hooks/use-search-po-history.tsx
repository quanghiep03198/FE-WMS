import { useLocalStorageState } from 'ahooks'

export const useSearchPurchaseOrderHistory = () => {
	return useLocalStorageState<string[]>('recentPurchaseOrderSearchTerms', {
		listenStorageChange: true,
		defaultValue: []
	})
}
