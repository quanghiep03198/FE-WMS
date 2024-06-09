import { cn } from '@/common/utils/cn'
import { Header, SortDirection, Table, flexRender } from '@tanstack/react-table'
import { useContext } from 'react'
import { Div, Collapsible, CollapsibleContent, Icon } from '../..'
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
	const { isFilterOpened: isFilterCollapsed, setIsFilterOpened: setIsFilterCollapsed } = useContext(TableContext)

	return (
		<Collapsible
			open={isFilterCollapsed}
			onOpenChange={setIsFilterCollapsed}
			className={cn('flex flex-col items-stretch divide-y divide-border')}>
			<Div
				className={cn('relative inline-flex cursor-auto touch-none select-none items-center gap-x-2 py-2', {
					'cursor-pointer hover:text-foreground': header.column.columnDef.enableSorting,
					'cursor-col-resize': header.column.getIsResizing()
				})}
				onClick={() => {
					if (header.column.columnDef.enableSorting) {
						header.column.toggleSorting(header.column.getIsSorted() === 'asc')
					}
				}}>
				{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
				<SortStatus enableSorting={header.column.columnDef.enableSorting} isSorted={header.column.getIsSorted()} />
			</Div>
			<CollapsibleContent className='w-full'>
				<ColumnFilter column={header.column} />
			</CollapsibleContent>
		</Collapsible>
	)
}

function SortStatus({ isSorted, enableSorting }: ColumnSortingProps) {
	if (!enableSorting) return null
	return <Icon name={isSorted === 'asc' ? 'ArrowDown' : isSorted === 'desc' ? 'ArrowUp' : 'ArrowUpDown'} />
}

export { TableCellHead }
