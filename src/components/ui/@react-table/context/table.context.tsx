import { ColumnFiltersState, ColumnOrderState, SortingState } from '@tanstack/react-table'
import { createContext, use } from 'react'

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
	columnOrder: ColumnOrderState
	tableWrapperRef: React.RefObject<HTMLDivElement>
	setAutoResetPageIndex: React.Dispatch<React.SetStateAction<boolean>>
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>
	setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
	setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
	setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>
}

export const TableContext = createContext<TableContext>(null)

export const useTableContext = () => use(TableContext)
