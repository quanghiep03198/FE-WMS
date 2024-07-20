import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { createContext, useContext } from 'react'

type TableContext = {
	globalFilter: string
	columnFilters: ColumnFiltersState
	hasNoFilter: boolean
	sorting: SortingState
	isScrolling: boolean
	isFilterOpened: boolean
	enableGlobalFilter: boolean
	manualSorting: boolean
	autoResetPageIndex: boolean
	skipAutoResetPageIndex: React.Dispatch<React.SetStateAction<boolean>>
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>
	setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
	setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
	setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => useContext(TableContext)
