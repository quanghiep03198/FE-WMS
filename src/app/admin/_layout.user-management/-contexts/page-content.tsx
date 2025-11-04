import { CommonActions } from '@/common/constants/enums'
import { IUserManagement } from '@/common/types/entities'
import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React, { createContext } from 'react'

type UserManagementPageEvent =
	| {
			action: CommonActions.CREATE
	  }
	| {
			action: CommonActions.UPDATE
			payload: Partial<IUserManagement> & Required<Pick<IUserManagement, 'keyid'>>
	  }

export const PageContext = createContext<{
	event$: EventEmitter<UserManagementPageEvent>
}>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<UserManagementPageEvent>()
	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageProvider = () => React.useContext(PageContext)
