import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { IStorageLocation } from '../types'

type EventPayload = { action: CommonActions.UPDATE; payload: Pick<IStorageLocation, '_id' | 'name'> }

const PageContext = createContext<{
	event$: EventEmitter<EventPayload>
}>({} as { event$: EventEmitter<EventPayload> })

export const StorageLocationPageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()
	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const useStorageLocationPageContext = () => use(PageContext)
