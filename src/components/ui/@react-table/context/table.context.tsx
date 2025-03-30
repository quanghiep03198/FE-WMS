import { createContext, use } from 'react'

type TableContext = {
	instanceId: string
	hasNoFilter: boolean
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => use(TableContext)
