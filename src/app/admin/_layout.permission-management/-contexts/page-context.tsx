'use client'

import { CommonActions } from '@/common/constants/enums'
import { IPermission } from '@/common/types/entities'
import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React, { createContext } from 'react'

type PermissionPageEvent =
	| {
			action: CommonActions.CREATE
			rows: IPermission[]
	  }
	| {
			action: CommonActions.UPDATE
			payload: Partial<IPermission> & Required<Pick<IPermission, 'id'>>
			rows: IPermission[]
	  }

export const PageContext = createContext<{
	event$: EventEmitter<PermissionPageEvent>
}>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const event$ = useEventEmitter<PermissionPageEvent>()

	return <PageContext.Provider value={{ event$ }}>{children}</PageContext.Provider>
}

export const usePageProvider = () => React.useContext(PageContext)
