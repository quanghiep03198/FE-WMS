import useVirtualScrollPadding from '@/common/hooks/use-virtual-scroll-padding'
import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { fuzzyFilter } from '@/components/ui/@react-table/utils'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { Fragment, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const EpcTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)

	const columnHelper = createColumnHelper<IDefectiveGoods>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('epc', {
				header: 'EPC',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { align: 'left' },
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			columnHelper.accessor('size_code', {
				header: 'Size',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				cell: TableCellText
			})
		],
		[i18n.language]
	)

	const table = useReactTable({
		columns,
		data: [],
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableRowSelection: true,
		enableColumnFilters: true,
		enableSorting: true,
		filterFns: {
			fuzzy: fuzzyFilter,
			inDateRange: null
		}
	})

	const { rows } = table.getRowModel()

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => 40,
		overscan: 10
	})

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(rowVirtualizer)

	return (
		<Div ref={containerRef} className='h-[calc(var(--outlet-wrapper-height)-var(--header-height))] overflow-scroll'>
			<Table className='table-auto'>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<Fragment key={headerGroup.id}>
							<TableRow>
								{headerGroup.headers.map((header) => {
									const { columnDef } = header.column
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											className='bg-table-head'
											style={{ width: header.getSize() }}
											align={columnDef.meta?.align}>
											{header.isPlaceholder ? null : (
												<Div
													align={columnDef.meta?.align}
													className='line-clamp-1 text-left text-sm text-inherit'>
													{flexRender(columnDef.header, header.getContext())}
												</Div>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						</Fragment>
					))}
				</TableHeader>
				{rows.length === 0 ? (
					<TableBody className='h-[calc(var(--outlet-wrapper-height)-var(--header-height)-45px)]'>
						<TableRow>
							<TableCell colSpan={table.getAllColumns().length} className='p-0'>
								<Div className='sticky left-0 top-0 flex items-center justify-center gap-x-2 text-muted-foreground'>
									<Icon name='Database' strokeWidth={1} size={32} /> No data
								</Div>
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody style={{ height: rowVirtualizer.getTotalSize() + 'px' }}>
						{/* Top padding */}
						{before > 0 && (
							<TableRow style={{ height: before }}>
								<TableCell colSpan={table.getAllColumns().length} />
							</TableRow>
						)}
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const row = rows[virtualRow.index]

							return (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => {
										const { columnDef } = cell.column
										return (
											<TableCell
												key={cell.id}
												style={{ width: cell.column.getSize() }}
												align={columnDef.meta?.align}>
												{flexRender(columnDef.cell, cell.getContext())}
											</TableCell>
										)
									})}
								</TableRow>
							)
						})}
						{after > 0 && (
							<TableRow style={{ height: after }}>
								<TableCell colSpan={table.getAllColumns().length} />
							</TableRow>
						)}
					</TableBody>
				)}
			</Table>
		</Div>
	)
}

export default EpcTable
