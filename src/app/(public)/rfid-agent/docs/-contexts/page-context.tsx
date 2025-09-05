import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React, { createContext, use } from 'react'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'

export const PageContext = createContext<{ event$: EventEmitter<DocumentHashNavigation> }>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<DocumentHashNavigation>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageContext = () => use(PageContext)
