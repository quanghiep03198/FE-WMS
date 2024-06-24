import { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { createContext } from 'react'

type TableContext = {
	globalFilter: string
	columnFilters: ColumnFiltersState
	hasNoFilter: boolean
	sorting: SortingState
	isScrolling: boolean
	isFilterOpened: boolean
	setIsFilterOpened: React.Dispatch<React.SetStateAction<boolean>>
	setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
	setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>
	setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>
}

export const TableContext = createContext<TableContext>({
	globalFilter: '',
	columnFilters: [],
	sorting: [],
	isScrolling: false,
	isFilterOpened: false,
	hasNoFilter: false,
	setIsFilterOpened: () => undefined,
	setIsScrolling: () => undefined,
	setGlobalFilter: () => undefined,
	setColumnFilters: () => undefined,
	setSorting: () => undefined
})
