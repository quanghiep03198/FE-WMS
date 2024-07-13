import { Column, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { CSSProperties } from 'react'

export class DataTableUtility {
	/**
	 * @description Transform column filters from array to object
	 * @param {SortingState} sorting
	 * @returns {Record<string, any>}
	 */
	public static getColumnFiltersObject(columnFilters: ColumnFiltersState) {
		if (!Array.isArray(columnFilters) || columnFilters.length === 0) return {}
		return columnFilters.reduce((accumulator, currentValue) => {
			accumulator[currentValue.id] = currentValue.value
			return accumulator
		}, {})
	}

	/**
	 * @description Transform sorting state from array to object
	 * @param {SortingState} sorting
	 * @returns {Record<string, 'desc' | 'asc'>}
	 */
	public static getColumnSortingObject(sorting: SortingState) {
		if (!Array.isArray(sorting) || sorting.length === 0) return {}
		return sorting.reduce((accumulator, currentValue) => {
			accumulator[currentValue?.id] = currentValue.desc ? 'desc' : 'asc'
			return accumulator
		}, {})
	}

	public static getStickyOffsetPosition<TData = any, TValue = any>(
		column: Column<TData, TValue>
	): CSSProperties | undefined {
		const stickyAlignment = column?.columnDef?.meta?.sticky
		switch (stickyAlignment) {
			case 'left':
				if (column.getIsFirstColumn()) return { position: 'sticky', left: 0 }
				return { left: column.getStart() }
			case 'right':
				if (column.getIsLastColumn()) return { right: 0 }
				return { position: 'sticky', right: column.getAfter() }
			default:
				return
		}
	}
}
