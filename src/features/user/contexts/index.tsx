import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import { type EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'
import type { UpdateUserFormValues } from '../schemas/user.schema'

type EventEmitterValue =
	| { action: CommonActions.CREATE; payload?: never }
	| { action: CommonActions.UPDATE; payload: Required<UpdateUserFormValues> }

type TPageContext = {
	event$: EventEmitter<EventEmitterValue>
}

const PageContext = createContext<TPageContext>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<EventEmitterValue>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
