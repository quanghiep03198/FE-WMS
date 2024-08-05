import { Column, ColumnFiltersState, SortingState, Table } from '@tanstack/react-table'
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
		column: Column<TData, TValue>,
		table?: Table<TData>
	): CSSProperties {
		const stickyAlignment = column.getIsPinned()

		switch (stickyAlignment) {
			case 'left': {
				if (column.getIsFirstColumn('left')) return { position: 'sticky', zIndex: 10, left: 0 }
				return { position: 'sticky', zIndex: 10, left: column.getStart('left') }
			}
			case 'right': {
				if (column.getIsLastColumn('right'))
					return {
						position: 'sticky',
						right: 0,
						zIndex: 10,
						borderRight: 'none',
						borderLeft: '1px solid hsl(var(--border))'
					}
				return {
					position: 'sticky',
					zIndex: 10,
					right: column.getAfter('right'),
					borderRight: column.getIsLastColumn('right') ? '1px solid hsl(var(--border)) !important' : 'none',
					borderLeft: '1px solid hsl(var(--border))'
				}
			}
			default: {
				return {
					position: 'relative',
					borderRight: column.getIsLastColumn('center') ? 'none' : '1px solid hsl(var(--border))'
				}
			}
		}
	}
}
