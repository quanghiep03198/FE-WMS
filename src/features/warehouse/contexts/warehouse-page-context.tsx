import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { IWarehouse } from '../types'

type EventPayload =
	| { action: CommonActions.CREATE; payload: null }
	| { action: CommonActions.UPDATE; payload: Pick<IWarehouse, 'name' | 'capacity'> }

const PageContext = createContext<{
	event$: EventEmitter<EventPayload>
}>({} as { event$: EventEmitter<EventPayload> })

export const WarehousePageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()
	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const useWarehousePageContext = () => use(PageContext)
