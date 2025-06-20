import { SizeQuantity } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Collapsible,
	CollapsibleContent,
	Div,
	Icon,
	ScrollArea,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@react-table/components/debounced-input'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzyFilter } from '@/components/ui/@react-table/utils'
import {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable
} from '@tanstack/react-table'
import { capitalize } from 'lodash'
import React, { Fragment, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SizeTable from './size-table'

type DataTableProps<T> = {
	data: Array<T>
	columns: ColumnDef<T, any>[]
	caption: string
	dataType: 'inbound' | 'outbound'
	footer: React.FC<{ rows: Row<T>[] }>
}

const getCanSticky = (columnId: string): React.CSSProperties => {
	if (columnId !== ROW_EXPANSION_COLUMN_ID) return {}
	return { position: 'sticky', left: 0, zIndex: 10 }
}

export default function DataTable<T extends { inv_sizes: SizeQuantity }>({
	data,
	dataType,
	columns,
	caption,
	footer: TableFooter
}: DataTableProps<T>) {
	'use no memo'

	const { t } = useTranslation()
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const captionId = useId()

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
			inDateRange: null
		},
		initialState: {
			sorting: [],
			columnFilters: [],
			expanded: {}
		},
		state: {
			sorting,
			columnFilters,
			expanded
		},
		enableColumnFilters: true,
		enableSorting: true,
		enableExpanding: true,
		enableMultiSort: true,
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		onExpandedChange: setExpanded,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	})

	const { rows } = table.getRowModel()

	return (
		<Div className='space-y-4 rounded-md border px-2 py-5 shadow-sm'>
			<Div className='mx-3 flex h-9 w-full max-w-[280px] items-center space-x-2 rounded-md border px-2 py-1 transition-colors duration-200 focus-within:border-primary'>
				<Icon name='Search' size={18} />
				<DebouncedInput
					type='search'
					value={table.getState().globalFilter ?? ''}
					onChange={(value) => table.setGlobalFilter(String(value))}
					className='font-lg border bg-transparent px-0 text-sm placeholder:text-sm'
					placeholder={capitalize(
						t('ns_common:form_placeholder.search', {
							object: dataType === 'inbound' ? t('ns_erp:fields.mo_no') : t('ns_erp:fields.po'),
							defaultValue: 'Search ...'
						})
					)}
				/>
			</Div>
			<ScrollArea className='h-72 rounded-sm px-3'>
				<Table className='w-full table-fixed border-separate border-spacing-0'>
					<TableCaption id={captionId} className='sr-only'>
						{caption}
					</TableCaption>
					<TableHeader className='&_th>span]:line-clamp-1 sticky top-0 z-20 border-b [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:h-10 [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
						<TableRow>
							{table.getHeaderGroups().map((headerGroup) =>
								headerGroup.headers.map((header) => {
									const { columnDef, getIsSorted, getToggleSortingHandler } = header.column
									const toggleSorting = columnDef.enableSorting ? getToggleSortingHandler() : undefined
									const currentSortingState: React.ComponentProps<typeof Icon>['name'] = (() => {
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
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											align={columnDef.meta?.align ?? 'left'}
											style={{
												width: header.column.getSize(),
												...getCanSticky(header.column.id)
											}}
											className='relative'>
											<button
												className={cn(
													'flex h-max w-full cursor-auto select-none grid-cols-[14px_auto] items-center text-left text-sm capitalize [&:has([role=button])]:w-full [&:has([role=button])]:justify-center [&:has([role=checkbox])]:w-full [&:has([role=checkbox])]:!justify-center',
													{
														'cursor-pointer gap-x-2 hover:text-foreground': columnDef.enableSorting,
														'justify-center text-center':
															header.colSpan > 1 || columnDef.meta?.align === 'center',
														'justify-start text-left': columnDef.meta?.align === 'left',
														'justify-end': columnDef.meta?.align === 'right'
													}
												)}
												style={
													{
														'--icon-size': '14px'
													} as React.CSSProperties
												}
												onClick={toggleSorting}>
												{columnDef.enableSorting && (
													<Icon
														name={currentSortingState}
														size={14}
														className='min-w-[var(--icon-size)] max-w-[var(--icon-size)]'
													/>
												)}
												<Typography
													as='small'
													variant='small'
													className='line-clamp-1 text-left text-inherit'>
													{flexRender(columnDef.header, header.getContext())}
												</Typography>
											</button>
										</TableHead>
									)
								})
							)}
						</TableRow>
					</TableHeader>
					<TableBody className='divide-y'>
						{rows.length > 0 ? (
							rows.map((row, index) => (
								<TableRowData key={row.id} row={row} isLastRow={index === rows.length - 1} />
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length}>
									<Div className='flex h-40 items-center justify-center gap-x-4 text-sm text-muted-foreground'>
										<Icon name='Database' size={28} strokeWidth={1.5} />
										{t('ns_common:table.no_data')}
									</Div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					<TableFooter rows={table.getFilteredRowModel().rows} />
				</Table>
			</ScrollArea>
			<Typography aria-labelledby={captionId} className='block text-center text-sm text-muted-foreground'>
				{caption}
			</Typography>
		</Div>
	)
}

function TableRowData<T extends { inv_sizes: SizeQuantity }>({ row, isLastRow }: { row: Row<T>; isLastRow: boolean }) {
	'use no memo'
	return (
		<Fragment>
			<TableRow className={cn('&_td]:h-10 [&_td]:border-x-0', isLastRow && '[&_td]:border-0')}>
				{row.getVisibleCells().map((cell) => {
					const meta = cell.column.columnDef.meta
					return (
						<TableCell
							{...cell.column.columnDef?.meta?.tableCellProps}
							key={cell.id}
							style={{
								position: 'relative',
								width: cell.column.getSize(),
								...getCanSticky(cell.column.id)
							}}>
							<Div
								className={cn('w-full max-w-full place-content-center truncate overflow-ellipsis text-sm', {
									'!text-left': meta?.align === 'left',
									'!text-center': meta?.align === 'center',
									'!text-right': meta?.align === 'right'
								})}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Div>
						</TableCell>
					)
				})}
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={row.getVisibleCells().length}
					className={cn('p-0', !row.getIsExpanded() && 'border-none shadow-none')}>
					<Collapsible open={row.getIsExpanded()} data-state={row.getIsExpanded() ? 'open' : 'closed'}>
						<CollapsibleContent
							className='overflow-auto bg-accent/80 transition-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down dark:bg-accent/50'
							style={{ scrollbarGutter: 'stable' }}>
							<Div className='p-4'>
								<SizeTable
									data={row.original.inv_sizes}
									total={
										Array.isArray(row.original.inv_sizes) &&
										row.original.inv_sizes.reduce((acc, curr) => acc + curr.qty, 0)
									}
								/>
							</Div>
						</CollapsibleContent>
					</Collapsible>
				</TableCell>
			</TableRow>
		</Fragment>
	)
}
