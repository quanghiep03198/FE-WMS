import { cn } from '@/common/utils/cn'
import { Header, SortDirection, Table, flexRender } from '@tanstack/react-table'
import { useContext } from 'react'
import { Div, Icon } from '../..'
import { TableContext } from '../context/table.context'
import { ColumnFilter } from './column-filter'

type TableCellHeadProps<TData, TValue> = {
	header: Header<TData, TValue>
	table: Table<TData>
}
type ColumnSortingProps = {
	isSorted: false | SortDirection
	enableSorting?: boolean
}

function TableCellHead<TData, TValue>({ header }: TableCellHeadProps<TData, TValue>) {
	const { isFilterOpened } = useContext(TableContext)
	const { columnDef, getIsResizing, getIsSorted, getToggleSortingHandler } = header.column

	return (
		<Div
			className={cn(
				'transtion-height grid h-full auto-rows-fr items-stretch',
				isFilterOpened ? 'grid-rows-2' : 'grid-rows-1'
			)}>
			<Div
				className={cn('relative line-clamp-1 inline-flex h-full cursor-auto select-none items-center px-4', {
					'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
					'cursor-col-resize': getIsResizing(),
					'border-b': isFilterOpened
				})}
				title={
					header.column.getCanSort()
						? header.column.getNextSortingOrder() === 'asc'
							? 'Sort ascending'
							: header.column.getNextSortingOrder() === 'desc'
								? 'Sort descending'
								: 'Clear sort'
						: undefined
				}
				onClick={getToggleSortingHandler()}>
				{header.isPlaceholder ? null : flexRender(columnDef.header, header.getContext())}
				<SortStatus enableSorting={columnDef.enableSorting} isSorted={getIsSorted()} />
			</Div>
			{isFilterOpened && <ColumnFilter column={header.column} />}
		</Div>
	)
}

function SortStatus({ isSorted, enableSorting }: ColumnSortingProps) {
	if (!enableSorting) return null
	return <Icon name={isSorted === 'asc' ? 'ArrowDown' : isSorted === 'desc' ? 'ArrowUp' : 'ArrowUpDown'} />
}

export { TableCellHead }
