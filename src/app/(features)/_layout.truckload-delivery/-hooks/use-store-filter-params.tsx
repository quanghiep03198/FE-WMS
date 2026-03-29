import { useSessionStorageState } from 'ahooks'
import type { TruckloadDeliveryFilterFormValues } from '../-schemas'
import { truckloadDeliveryFilterSchema } from '../-schemas'

export const STORAGE_DELIVERY_FILTER_KEY = 'truckloadDeliveryFilters'

export const useStoreFilterParams = () =>
	useSessionStorageState<TruckloadDeliveryFilterFormValues>(STORAGE_DELIVERY_FILTER_KEY, {
		defaultValue: truckloadDeliveryFilterSchema.parse(undefined),
		listenStorageChange: true
	})
