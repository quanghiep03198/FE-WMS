import type { CommonActions } from '@/common/constants/enums'
import type { ITruckloadDelivery, TruckloadDeliveryDispatchOrder } from '@/services/truckload-delivery.service'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

export type SignatureType =
	| 'ie_signature'
	| 'warehouse_officer_signature'
	| 'security_1_signature'
	| 'security_2_signature'

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

type PageContextValue = {
	event$: EventEmitter<EventPayload>
}

const PageContext = createContext<PageContextValue>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
