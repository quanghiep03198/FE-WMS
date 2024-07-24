import { cn } from '@/common/utils/cn'
import { Header, Table, flexRender } from '@tanstack/react-table'
import { Icon, Typography } from '../..'

type TableCellHeadProps<TData, TValue> = {
	header: Header<TData, TValue>
	table: Table<TData>
}

export function TableCellHead<TData, TValue>({ header }: TableCellHeadProps<TData, TValue>) {
	const { columnDef, getIsResizing, getIsSorted, getToggleSortingHandler, getNextSortingOrder } = header.column

	const toggleSorting = columnDef.enableSorting ? getToggleSortingHandler() : undefined

	return (
		<Typography
			variant='small'
			className={cn(
				'relative line-clamp-1 flex justify-center h-full cursor-auto select-none items-center capitalize text-center',
				{
					'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
					'cursor-col-resize': getIsResizing()
				}
			)}
			onClick={toggleSorting}
			title={
				header.column.getCanSort()
					? getNextSortingOrder() === 'asc'
						? 'Sort ascending'
						: getNextSortingOrder() === 'desc'
							? 'Sort descending'
							: 'Clear sort'
					: undefined
			}>
			{flexRender(columnDef.header, header.getContext())}
			{columnDef.enableSorting && (
				<Icon
					name={getIsSorted() === 'asc' ? 'ArrowDown' : getIsSorted() === 'desc' ? 'ArrowUp' : 'ArrowUpDown'}
					size={16}
				/>
			)}
		</Typography>
	)
}
