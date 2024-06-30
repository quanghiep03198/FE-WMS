import '@tanstack/react-table'
import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		filterComponent?: React.ReactNode<TData, TValue>
		sortComponent?: React.ReactNode<TData, TValue>
		sticky?: 'left' | 'right'
	}
}
