import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { UpdateRFIDReaderFormValues } from '../-schemas/rfid-device.schema'

type EventPayload =
	| { action: CommonActions.CREATE; defaultValues: null }
	| { action: CommonActions.UPDATE; defaultValues: UpdateRFIDReaderFormValues }

const PageContext = createContext<{
	event$: EventEmitter<EventPayload>
}>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()
	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
