import { useLocalStorageState } from 'ahooks'

export const useSearchPoHistory = () => {
	return useLocalStorageState('recentPurchaseOrderSearchTerms', {
		listenStorageChange: true,
		defaultValue: []
	})
}
