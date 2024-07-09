import '@tanstack/react-table'
import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		facetedUniqueValues?: Array<Record<'label' | 'value', any>>
		filterVariant?: 'text' | 'range' | 'select'
		sticky?: 'left' | 'right'
	}

	//add fuzzy filter to the filterFns
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}
