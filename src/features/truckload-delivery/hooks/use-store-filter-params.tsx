import { usePageContext } from '../contexts/page-context'

export const STORAGE_DELIVERY_FILTER_KEY = 'truckloadDeliveryFilters'

export const useStoreFilterParams = () => {
	const { storedFilterParams, setStoredFilterParams } = usePageContext()
	return [storedFilterParams, setStoredFilterParams] as const
}
