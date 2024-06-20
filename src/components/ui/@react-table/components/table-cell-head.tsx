import { cn } from '@/common/utils/cn'
import { Header, SortDirection, Table, flexRender } from '@tanstack/react-table'
import { useContext } from 'react'
import { Div, Collapsible, CollapsibleContent, Icon, Separator, Typography } from '../..'
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

function TableCellHead<TData, TValue>({ header, ...props }: TableCellHeadProps<TData, TValue>) {
	const { isFilterOpened, setIsFilterOpened } = useContext(TableContext)

	const { columnDef, getIsResizing, toggleSorting, getIsSorted } = header.column

	return (
		<Collapsible
			open={isFilterOpened}
			onOpenChange={setIsFilterOpened}
			className={cn('grid auto-rows-fr grid-cols-1 items-stretch divide-y divide-border')}>
			<Div
				className={cn('relative line-clamp-1 inline-flex cursor-auto touch-none select-none items-center py-2', {
					'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
					'cursor-col-resize': getIsResizing()
				})}
				onClick={() => {
					if (columnDef.enableSorting) {
						toggleSorting(getIsSorted() === 'asc')
					}
				}}>
				<Typography variant='small' className='line-clamp-1 text-inherit'>
					{header.isPlaceholder ? null : flexRender(columnDef.header, header.getContext())}
				</Typography>
				<SortStatus enableSorting={columnDef.enableSorting} isSorted={getIsSorted()} />
			</Div>
			<CollapsibleContent>
				{columnDef.meta?.filterComponent ?? <ColumnFilter column={header.column} />}
			</CollapsibleContent>
		</Collapsible>
	)
}

function SortStatus({ isSorted, enableSorting }: ColumnSortingProps) {
	if (!enableSorting) return null
	return <Icon name={isSorted === 'asc' ? 'ArrowDown' : isSorted === 'desc' ? 'ArrowUp' : 'ArrowUpDown'} />
}

export { TableCellHead }
