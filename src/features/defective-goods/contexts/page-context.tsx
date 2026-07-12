import type { IDefectiveGoods } from '@/features/defective-goods/services/defective-goods.service'
import type { CommonActions } from '@common/constants/enums'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

const PageContext = createContext<{
	event$: EventEmitter<{ action: CommonActions; payload: IDefectiveGoods | number | string | string[] }>
}>(null)

export const PageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<{ action: CommonActions; payload: IDefectiveGoods | string }>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
