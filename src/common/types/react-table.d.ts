import { DropdownSelectProps, MultiSelectProps, TableCell } from '@/components/ui'
import { DateRangePickerProps } from '@/components/ui/@core/date-range-picker'
import { DebouncedInputProps } from '@/components/ui/@react-table/components/debounced-input'
import { NumberRangeFilterProps } from '@/components/ui/@react-table/components/number-range-filter'
import '@tanstack/react-table'
import { Row, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	type FilterComponentProps = {
		readonly ['text']?: DebouncedInputProps<any>
		readonly ['range']?: NumberRangeFilterProps<any>
		readonly ['select']?: DropdownSelectProps<any>
		readonly ['multi-select']?: MultiSelectProps<any>
		readonly ['date']?: DateRangePickerProps<any>
	}

	export type ColumnFilterVariant = keyof FilterComponentProps

	interface ColumnMeta<TData extends RowData, TValue> {
		facetedUniqueValues?: Array<Record<'label' | 'value', any>>
		filterVariant?: Variant
		filterComponentProps?: FilterComponentProps[Variant]
		sticky?: 'left' | 'right'
		rowSpan?: number
		align?: 'left' | 'center' | 'right'
		cellDataType?: 'text' | 'number' | 'date' | 'boolean'
		tableCellProps?: React.ComponentProps<typeof TableCell>
		validate?: (value: TValue) => boolean
	}

	interface ColumnMetaWithFilterProps<TData extends RowData, TValue, Variant extends ColumnFilterVariant>
		extends ColumnMeta<TData, TValue> {
		filterComponentProps?: Partial<FilterComponentProps[Variant]>
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
