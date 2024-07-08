import { ColumnFiltersState, SortingState } from '@tanstack/react-table'

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
}
