import type { CommonActions } from '@common/constants/enums'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

type EventPayload =
	| { action: CommonActions.UPDATE; payload: IDefectiveGoods }
	| { action: CommonActions.IMPORT; payload: string[] }
	| { action: CommonActions.SAVE; payload: [] }

const PageContext = createContext<{
	event$: EventEmitter<EventPayload>
}>(null!)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
