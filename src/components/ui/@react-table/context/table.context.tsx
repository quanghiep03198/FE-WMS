import { createContext, use } from 'react'

type TableContext = {
	hasNoFilter: boolean
	isFilterOpened: boolean
	enableGlobalFilter: boolean
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => use(TableContext)
