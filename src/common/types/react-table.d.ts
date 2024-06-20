import '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		filterComponent?: React.ReactNode
		sortComponent?: React.ReactNode
		sticky?: 'left' | 'right'
		disabled?: boolean
	}
}
