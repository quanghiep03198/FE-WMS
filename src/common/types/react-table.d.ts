/* eslint-disable no-mixed-spaces-and-tabs */
import '@tanstack/react-table'
import { Row, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		facetedUniqueValues?: Array<Record<'label' | 'value', any>>
		filterVariant?: 'text' | 'range' | 'select'
		sticky?: 'left' | 'right'
		rowSpan?: number
		cellDataType?: 'text' | 'number' | 'date' | 'boolean'
	}

	interface TableMeta<TData extends RowData> {
		editedRows: Record<Row<TData>['id'], boolean>
		setEditedRows: React.Dispatch<React.SetStateAction<Record<Row<TData>['id'], boolean>>>
		// updateRow: (rowIndex: number) => void
		updateData: (rowIndex: number, columnId: string, value: unknown) => void
		revertDataChanges: (rowIndex: number) => void
		revertAllDataChanges: () => void
		getUnsavedChanges: () => TData[]
	}

	//add fuzzy filter to the filterFns
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}
