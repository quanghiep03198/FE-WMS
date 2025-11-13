import { CommonActions } from '@/common/constants/enums'
import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

type EventPayload =
	| { action: CommonActions.CREATE; payload: null }
	| { action: CommonActions.UPDATE; payload: any }
	| { action: CommonActions.CONFIRM; payload: any }
	| { action: CommonActions.DELETE; payload: number | number[] }

type PageContextValue = {
	event$: EventEmitter<EventPayload>
}

const PageContext = createContext<PageContextValue>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
