import { cn } from '@/common/utils/cn'
import { ArrowDownIcon, ArrowUpIcon, EyeClosedIcon, WidthIcon } from '@radix-ui/react-icons'
import { Header, flexRender } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { pick } from 'lodash-es'
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
	Icon,
	Typography
} from '../..'
import { useTableContext } from '../context/table.context'

type TableCellHeadProps<TData, TValue> = {
	header: Header<TData, TValue>
}

export default function TableCellHead<TData, TValue>({ header }: TableCellHeadProps<TData, TValue>) {
	const { t } = useTranslation()
	const { columnDef, getIsResizing, getIsSorted, getToggleSortingHandler, getNextSortingOrder } = header.column
	const toggleSorting = columnDef.enableSorting ? getToggleSortingHandler() : undefined
	const rerender = useUpdate()
	const { table, event$ } = useTableContext('table', 'event$')

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

	const headerTitle = header.column.getCanSort()
		? getNextSortingOrder() === 'asc'
			? t('ns_common:table.sort_asc')
			: getNextSortingOrder() === 'desc'
				? t('ns_common:table.sort_desc')
				: t('ns_common:table.clear_sort')
		: undefined

	if (header.colSpan > 1) return <>{flexRender(columnDef.header, header.getContext())}</>

	return (
		<ContextMenu>
			<ContextMenuTrigger
				className={cn(
					'flex h-max w-full cursor-auto select-none grid-cols-[14px_auto] items-center px-4 py-2 text-left text-sm capitalize [&:has([role=button])]:w-full [&:has([role=button])]:justify-center [&:has([role=checkbox])]:w-full [&:has([role=checkbox])]:!justify-center',
					{
						'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
						'cursor-col-resize': getIsResizing(),
						'justify-center text-center': header.colSpan > 1 || columnDef.meta?.align === 'center',
						'justify-start text-left': columnDef.meta?.align === 'left',
						'justify-end': columnDef.meta?.align === 'right'
					}
				)}
				style={
					{
						'--icon-size': '14px',
						minWidth: `calc(var(--header-${header?.id}-size)*1px)`
					} as React.CSSProperties
				}
				onClick={(e) => {
					if (typeof toggleSorting === 'function') toggleSorting(e)
					rerender()
				}}
				title={headerTitle}>
				{columnDef.enableSorting && (
					<Icon
						name={currentSortingState}
						size={14}
						className='h-[var(--icon-size)] min-w-[var(--icon-size)] max-w-[var(--icon-size)]'
					/>
				)}
				<Typography as='small' variant='small' className='line-clamp-1 text-left text-inherit'>
					{flexRender(columnDef.header, header.getContext())}
				</Typography>
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
						aria-disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						disabled={!header.isPlaceholder && !header.column.columnDef.enablePinning}
						className='gap-x-2 aria-disabled:text-muted-foreground'>
						<Icon name='Pin' size={14} />
						{t('ns_common:actions.pin')}
					</ContextMenuSubTrigger>
					<ContextMenuSubContent className='w-56'>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === false}
							onCheckedChange={() => {
								header.column.pin(false)
								event$.emit(pick(table.getState(), ['columnPinning']))
							}}>
							{t('ns_common:table.unpin')}
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === 'left'}
							onCheckedChange={() => {
								header.column.pin('left')
								event$.emit(pick(table.getState(), ['columnPinning']))
							}}>
							{t('ns_common:table.pin_left')}
						</ContextMenuCheckboxItem>
						<ContextMenuCheckboxItem
							checked={header.column.getIsPinned() === 'right'}
							onCheckedChange={() => {
								header.column.pin('right')
								event$.emit(pick(table.getState(), ['columnPinning']))
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
