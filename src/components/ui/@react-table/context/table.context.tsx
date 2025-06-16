import { Table } from '@tanstack/react-table'
import { createContext, use } from 'react'

type TableContext = {
	table: Table<any>
	instanceId: string
	hasNoFilter: boolean
	defaultFilterOpen: boolean
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => use(TableContext)
