import { Cell, ColumnFiltersState, ColumnMeta, SortingState, Table } from '@tanstack/react-table'
import React from 'react'

export class TableUtilities {
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

	public static getStickyOffsetPosition(
		columnStickyAlignment: ColumnMeta<any, any>['sticky'],
		columnIndex: number,
		instanceTable: Table<any>
	) {
		switch (columnStickyAlignment) {
			case 'left': {
				const previousColumns = instanceTable
					.getAllFlatColumns()
					.filter((column) => column.getIndex() < columnIndex)
				if (previousColumns.length === 0) return { right: 0 }
				return {
					left: previousColumns.reduce((acc, curr) => {
						return acc + curr.getSize()
					}, 0)
				}
			}
			case 'right': {
				const nextColumns = instanceTable.getAllFlatColumns().filter((column) => column.getIndex() > columnIndex)
				if (nextColumns.length === 0) return { right: 0 }
				return {
					right: nextColumns.reduce((acc, curr) => {
						return acc + curr.getSize()
					}, 0)
				}
			}
			default:
				return undefined
		}
	}
}
