import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { pick } from 'lodash'
import { createContext, useContext } from 'react'
import { StoreApi, useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type TableContextStore = {
	table: Table<any>
	filterOpen: boolean
	setFilterOpen: (open: boolean) => void
	event$: EventEmitter<Record<string, unknown>>
}

export const TableContext = createContext<StoreApi<TableContextStore>>(null)

export const useTableContext = <T extends TableContextStore, K extends keyof TableContextStore>(...selectors: K[]) => {
	const store = useContext(TableContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
