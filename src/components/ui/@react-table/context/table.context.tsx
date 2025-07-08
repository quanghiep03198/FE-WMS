import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext, use } from 'react'

type TableContext = {
	table: Table<any>
	instanceId: string
	hasNoFilter: boolean
	defaultFilterOpen: boolean
	event$: EventEmitter<Record<string, any>>
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => use(TableContext)
