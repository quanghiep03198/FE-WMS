import { cn } from '@/common/utils/cn'
import { Div, Icon, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import { flexRender, Header, HeaderGroup } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { memo, useMemo } from 'react'
import { TableRowData } from '.'
import { getCanSticky } from './utils'

type TableCellHeadProps<T extends TableRowData> = {
	header: Header<T, unknown>
} & React.PropsWithChildren

const DataTableHeader: React.FC<{ headerGroups: HeaderGroup<any>[] }> = ({ headerGroups }) => {
	'use no memo'

	return (
		<TableHeader className='&_th>span]:line-clamp-1 sticky top-0 z-20 border-b [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:h-10 [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
			<TableRow>
				{headerGroups.map((headerGroup) =>
					headerGroup.headers.map((header) => {
						const column = header.column
						const { columnDef } = header.column

						return (
							<TableHead
								key={header.id}
								colSpan={header.colSpan}
								align={columnDef.meta?.align ?? 'left'}
								title={columnDef.header.toString()}
								className='relative'
								style={{
									width: column.getSize(),
									...getCanSticky(column.id)
								}}>
								<TableCellHead header={header} />
							</TableHead>
						)
					})
				)}
			</TableRow>
		</TableHeader>
	)
}

const TableCellHead = function <T extends TableRowData>({ header }: TableCellHeadProps<T>) {
	const { columnDef, getIsSorted, getToggleSortingHandler } = header.column

	const columnMeta = columnDef.meta

	const sortingState = getIsSorted()

	const rerender = useUpdate()
	const currentSortingState: React.ComponentProps<typeof Icon>['name'] = useMemo(() => {
		switch (sortingState) {
			case 'asc':
				return 'ArrowUp'
			case 'desc':
				return 'ArrowDown'
			default:
				return 'ArrowUpDown'
		}
	}, [sortingState])

	const toggleSortingHandler = columnDef.enableSorting ? getToggleSortingHandler() : undefined

	const handleToggleSorting: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (typeof toggleSortingHandler === 'function') {
			toggleSortingHandler(e)
		}
		rerender()
	}

	return (
		<Div
			className={cn(
				'flex h-max w-full cursor-auto select-none grid-cols-[14px_auto] items-center text-left text-sm capitalize [&:has([role=button])]:w-full [&:has([role=button])]:justify-center [&:has([role=checkbox])]:w-full [&:has([role=checkbox])]:!justify-center',
				{
					'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
					'justify-center text-center': columnMeta?.align === 'center',
					'justify-start text-left': columnMeta?.align === 'left',
					'justify-end': columnMeta?.align === 'right'
				}
			)}
			style={
				{
					'--icon-size': '14px'
				} as React.CSSProperties
			}
			onClick={handleToggleSorting}>
			{columnDef.enableSorting && (
				<Icon name={currentSortingState} size={14} className='min-w-[var(--icon-size)] max-w-[var(--icon-size)]' />
			)}
			<Typography as='small' variant='small' className='line-clamp-1 text-left text-inherit'>
				{flexRender(columnDef.header, header.getContext())}
			</Typography>
		</Div>
	)
}

TableCellHead.displayName = 'DataTableCellHead'

const MemoizedDataTableHeader = memo(DataTableHeader)

export { DataTableHeader, MemoizedDataTableHeader }
