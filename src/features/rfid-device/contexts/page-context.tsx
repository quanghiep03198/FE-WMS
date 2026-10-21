import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { RFIDReaderFormValues } from '../schemas/rfid-device.schema'

type EventPayload =
	{ action: CommonActions.CREATE; payload: null } | { action: CommonActions.UPDATE; payload: RFIDReaderFormValues }

const PageContext = createContext<{
	event$: EventEmitter<EventPayload>
}>(null!)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()
	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
