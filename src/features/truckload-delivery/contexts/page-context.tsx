import type {
	ITruckloadDelivery,
	TruckloadDeliveryDispatchOrder
} from '@/features/truckload-delivery/services/truckload-delivery.service'
import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter, useSessionStorageState } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use, useMemo } from 'react'
import type { TruckloadDeliveryFilterFormValues } from '../schemas'
import { truckloadDeliveryFilterSchema } from '../schemas'
// type-only import — safe for circular module resolution (erased at runtime)
import type { PageQueryParams } from '../hooks/use-page-query-params'

// Mirror the string literals from the hook files to avoid circular runtime imports
const _STORAGE_FILTER_KEY = 'truckloadDeliveryFilters'
const _STORAGE_PARAMS_KEY = 'deliverySearchParams'

export type SignatureType =
	'ie_signature' | 'warehouse_officer_signature' | 'security_1_signature' | 'security_2_signature'

type EventPayload =
	| { action: CommonActions.CREATE; payload: null }
	| {
			action: CommonActions.UPDATE
			payload: {
				id: number
				po: string
				outbound_qty: number
			}
	  }
	| {
			action: CommonActions.UPDATE_MANY
			payload: Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'container_number'>
	  }
	| { action: CommonActions.SET_STATUS; payload: string }
	| { action: CommonActions.DELETE; payload: number }
	| { action: CommonActions.DELETE_MANY; payload: TruckloadDeliveryDispatchOrder }
	| {
			action: 'UPDATE_DISPATCH_ORDER_SIGNATURE'
			payload: Pick<ITruckloadDelivery, 'dispatch_order' | 'approval_status' | 'license_plate'> & {
				signature_type: SignatureType
			}
	  }

type SetStorageState<T> = (value?: T | ((prevState: T) => T)) => void

type PageContextValue = {
	event$: EventEmitter<EventPayload>
	searchParams: PageQueryParams
	setParams: SetStorageState<PageQueryParams>
	storedFilterParams: TruckloadDeliveryFilterFormValues
	setStoredFilterParams: SetStorageState<TruckloadDeliveryFilterFormValues>
}

const PageContext = createContext<PageContextValue>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()

	// ─── Registered ONCE here — all consumers read from context, no extra listeners ───
	const [storedFilterParams, setStoredFilterParams] = useSessionStorageState<TruckloadDeliveryFilterFormValues>(
		_STORAGE_FILTER_KEY,
		{ defaultValue: truckloadDeliveryFilterSchema.parse(undefined), listenStorageChange: true }
	)

	const [searchParams, setParams] = useSessionStorageState<PageQueryParams>(_STORAGE_PARAMS_KEY, {
		defaultValue: { page: 1, limit: 20 } as PageQueryParams,
		listenStorageChange: true
	})

	const value = useMemo(
		() => ({ event$, searchParams, setParams, storedFilterParams, setStoredFilterParams }),
		[event$, searchParams, setParams, storedFilterParams, setStoredFilterParams]
	)

	return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
