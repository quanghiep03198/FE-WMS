import { ColumnFiltersState, ColumnMeta, SortingState, Table } from '@tanstack/react-table'

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

	public static getStickyOffsetPosition(
		columnStickyAlignment: ColumnMeta<any, any>['sticky'],
		columnIndex: number,
		instanceTable: Table<any>
	) {
		const allLeafColumns = instanceTable.getAllLeafColumns()

		switch (columnStickyAlignment) {
			case 'left': {
				const previousColumns = allLeafColumns.filter((column) => column.getIndex() < columnIndex)
				if (columnIndex === 0) return { left: 0 }
				return {
					left: previousColumns.reduce((acc, curr) => {
						return acc + curr.getSize()
					}, 0)
				}
			}
			case 'right': {
				const nextColumns = allLeafColumns.filter((column) => column.getIndex() > columnIndex)
				if (columnIndex === allLeafColumns.length - 1) return { right: 0 }
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
