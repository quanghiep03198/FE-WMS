import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { UpdateDefectiveGoodsFormValues } from '../schemas/defective-goods.schema'

type EventPayload =
	| { action: CommonActions.UPDATE; payload: UpdateDefectiveGoodsFormValues }
	| { action: CommonActions.IMPORT; payload: string[] }
	| { action: CommonActions.SAVE; payload: [] }
	| { action: CommonActions.READ; payload: string }
	| { action: CommonActions.DELETE; payload: string }

const PageContext = createContext<{ event$: EventEmitter<EventPayload> }>(null!)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventPayload>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
