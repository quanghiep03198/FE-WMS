import { CommonActions } from '@/common/constants/enums'
import { IDefectiveGoods } from '@/common/types/entities'
import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

const PageContext = createContext<{
	event$: EventEmitter<{ action: CommonActions; payload: IDefectiveGoods | string }>
}>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<{ action: CommonActions; payload: IDefectiveGoods | string }>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
