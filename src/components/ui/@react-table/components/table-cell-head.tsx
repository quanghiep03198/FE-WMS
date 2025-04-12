'use no memo'

import { cn } from '@/common/utils/cn'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ArrowDownIcon, ArrowUpIcon, EyeClosedIcon, WidthIcon } from '@radix-ui/react-icons'
import { Header, Table, flexRender } from '@tanstack/react-table'
import { icons } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation()
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
			<ContextMenuTrigger className='line-clamp-1 w-auto ring-0 ring-offset-0 ring-offset-transparent focus:outline-none'>
				<Div
					className={cn(
						'relative line-clamp-1 flex h-full cursor-auto select-none items-center px-4 py-2 text-sm capitalize [&:has([role=button])]:w-full [&:has([role=button])]:justify-center [&:has([role=checkbox])]:w-full [&:has([role=checkbox])]:justify-center',
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
								? t('ns_common:table.sort_asc')
								: getNextSortingOrder() === 'desc'
									? t('ns_common:table.sort_desc')
									: t('ns_common:table.clear_sort')
							: undefined
					}>
					{columnDef.enableSorting && <Icon name={currentSortingState} size={14} />}
					{flexRender(columnDef.header, header.getContext())}
				</Div>
			</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuItem
					disabled={!columnDef.enableSorting}
					className='gap-x-2'
					onClick={() => header.column.toggleSorting(false)}>
					<ArrowUpIcon />
					{t('ns_common:table.sort_asc')}
				</ContextMenuItem>
				<ContextMenuItem
					disabled={!columnDef.enableSorting}
					className='gap-x-2'
					onClick={() => header.column.toggleSorting(true)}>
					<ArrowDownIcon />
					{t('ns_common:table.sort_desc')}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger
						// inset={true}
						aria-disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						className='gap-x-2 aria-disabled:text-muted-foreground'>
						<Icon name='Pin' size={14} />
						{t('ns_common:actions.pin')}
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className='w-56'>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === (false as CheckedState)}
							onCheckedChange={() => header.column.pin(false)}>
							{t('ns_common:table.unpin')}
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === ('left' as CheckedState)}
							onCheckedChange={() => header.column.pin('left')}>
							{t('ns_common:table.pin_left')}
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === ('right' as CheckedState)}
							onCheckedChange={() => {
								header.column.pin('right')
							}}>
							{t('ns_common:table.pin_right')}
						</ContextMenuCheckboxItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator className='h-[0.5px]' />
				<ContextMenuItem className='gap-x-2' onClick={header.column.resetSize}>
					<WidthIcon /> {t('ns_common:table.reset_size')}
				</ContextMenuItem>
				<ContextMenuItem className='gap-x-2' onClick={header.column.getToggleVisibilityHandler()}>
					<EyeClosedIcon /> {t('ns_common:table.hide_column')}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}
