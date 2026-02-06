import { createStoreSelector } from '@/common/hooks/use-store-selector'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext } from 'react'
import { StoreApi } from 'zustand'

export type TableContextStore = {
	table: Table<any>
	filterOpen: boolean
	setFilterOpen: (open: boolean) => void
	event$: EventEmitter<Record<string, unknown>>
}

export const TableContext = createContext<StoreApi<TableContextStore>>(null)

export const useTableContext = createStoreSelector(TableContext)
