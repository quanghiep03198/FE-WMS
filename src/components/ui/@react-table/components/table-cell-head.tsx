import { cn } from '@/common/utils/cn'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ArrowDownIcon, ArrowUpIcon, WidthIcon } from '@radix-ui/react-icons'
import { Header, Table, flexRender } from '@tanstack/react-table'
import { icons } from 'lucide-react'
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
	Div,
	Icon
} from '../..'

type TableCellHeadProps<TData, TValue> = {
	header: Header<TData, TValue>
	table: Table<TData>
}

export function TableCellHead<TData, TValue>({ header }: TableCellHeadProps<TData, TValue>) {
	const { columnDef, getIsResizing, getIsSorted, getToggleSortingHandler, getNextSortingOrder } = header.column

	const toggleSorting = columnDef.enableSorting ? getToggleSortingHandler() : undefined

	const currentSortingState: keyof typeof icons = (() => {
		switch (getIsSorted()) {
			case 'asc':
				return 'ArrowUp'
			case 'desc':
				return 'ArrowDown'
			default:
				return 'ArrowUpDown'
		}
	})()

	return (
		<ContextMenu>
			<ContextMenuTrigger className='focus:outline-none'>
				<Div
					className={cn(
						'text-sm px-4 py-2 relative line-clamp-1 flex h-full cursor-auto select-none capitalize [&:has([role=checkbox])]:w-full [&:has([role=checkbox])]:justify-center items-center',
						{
							'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
							'cursor-col-resize': getIsResizing(),
							'justify-center text-center': header.colSpan > 1 || columnDef.meta?.align === 'center',
							'justify-start text-left': columnDef.meta?.align === 'left',
							'justify-end text-right': columnDef.meta?.align === 'right'
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
					{columnDef.enableSorting && <Icon name={currentSortingState} size={14} className='min-w-[14px]' />}
				</Div>
			</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuItem
					disabled={!columnDef.enableSorting}
					className='gap-x-2'
					onClick={() => header.column.toggleSorting(false)}>
					<ArrowUpIcon />
					Sort ascending
				</ContextMenuItem>
				<ContextMenuItem
					disabled={!columnDef.enableSorting}
					className='gap-x-2'
					onClick={() => header.column.toggleSorting(true)}>
					<ArrowDownIcon />
					Sort descending
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger
						inset={true}
						aria-disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						className='aria-disabled:text-muted-foreground'>
						Pin
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className='w-56'>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === (false as CheckedState)}
							onCheckedChange={() => header.column.pin(false)}>
							No pin
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === ('left' as CheckedState)}
							onCheckedChange={() => header.column.pin('left')}>
							Pin left
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === ('right' as CheckedState)}
							onCheckedChange={() => {
								header.column.pin('right')
							}}>
							Pin right
						</ContextMenuCheckboxItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem className='gap-x-2' onClick={header.column.resetSize}>
					<WidthIcon /> Reset size
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}
