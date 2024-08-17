/* eslint-disable no-mixed-spaces-and-tabs */
import '@tanstack/react-table'
import { Row, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		facetedUniqueValues?: Array<Record<'label' | 'value', any>>
		filterVariant?: 'text' | 'range' | 'select' | 'date'
		sticky?: 'left' | 'right'
		rowSpan?: number
		align?: 'left' | 'center' | 'right'
		cellDataType?: 'text' | 'number' | 'date' | 'boolean'
		validate?: (value: TValue) => boolean
	}

	interface TableMeta<TData extends RowData> {
		editedRows: Record<Row<TData>['id'], boolean>
		setEditedRows: React.Dispatch<React.SetStateAction<Record<Row<TData>['id'], boolean>>>
		updateRow: (rowIndex: number, columnId: string, value: unknown) => void
		discardChanges: (rowIndex?: number) => void
		getUnsavedChanges: () => TData[]
	}

	//add fuzzy filter to the filterFns
	interface FilterFns {
		fuzzy: FilterFn<unknown>
		inDateRange: FilterFn<any>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}
