import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import useVirtualScrollPadding from '@/common/hooks/use-virtual-scroll-padding'
import { Table, TableBody, TableCell, TableRow, Typography } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { fuzzyFilter } from '@/components/ui/@react-table/utils'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import {
	createColumnHelper,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { format, isValid } from 'date-fns'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useFilterQuery } from '../../-hooks/use-filter-query'
import { DefectiveCategoryI18n } from '../../../-constants'
import { useReaderPlaygroundStore } from '../../../-contexts/rfid-reader-playground.context'
import { useDefectiveCategoryList } from '../../../-hooks/use-defective-category-list'
import { useGetCanInoutboundEpcQuery } from '../../../-hooks/use-defective-goods-asm'
import DataTableEmpty from './table-empty'
import DataTableFooter from './table-footer'
import { DataTableHeader, MemoizedDataTableHeader } from './table-header'
import DataTableLoading from './table-loading'
import { DataTableRow, MemoizedDataTableRow } from './table-row'

const EpcTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)
	const { searchParams } = useFilterQuery()
	const { setScannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'setScannedEpcs')
	const columnHelper = createColumnHelper<IDefectiveGoods>()
	const defectiveCategoryList = useDefectiveCategoryList()

	const { data, isLoading } = useGetCanInoutboundEpcQuery()

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
				size: 180,
				minSize: 150,
				cell: TableCellText
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: {
					align: 'left',
					filterVariant: 'autocomplete',
					facetedUniqueValues: ['KOOLABURRA', 'TEVA', 'UGG'].map((item) => ({ label: item, value: item }))
				},
				size: 150,
				minSize: 120,
				cell: TableCellText
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				meta: {
					align: 'left',
					filterVariant: 'autocomplete'
				},
				size: 150,
				minSize: 120,
				cell: TableCellText
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: {
					align: 'left',
					filterVariant: 'autocomplete'
				},
				size: 150,
				minSize: 120,
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				meta: {
					filterVariant: 'autocomplete'
				},
				size: 150,
				minSize: 150,
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				meta: {
					filterVariant: 'autocomplete'
				},
				size: 150,
				minSize: 150,
				cell: TableCellText
			}),
			columnHelper.accessor('defective_category', {
				header: t('ns_erp:fields.category'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'equalsString',
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: defectiveCategoryList
				},
				size: 160,
				minSize: 120,
				cell: ({ getValue }) => {
					const value = getValue()
					return t(DefectiveCategoryI18n[value], {
						ns: 'ns_inoutbound',
						defaultValue: t('ns_common:titles.unknown')
					})
				}
			}),
			columnHelper.accessor('size_code', {
				header: 'Size',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				size: 120,
				minSize: 100,
				cell: TableCellText
			}),
			...(searchParams.action === RFIDDataType.OUTBOUND
				? [
						columnHelper.accessor('inbound_date', {
							header: t('ns_erp:fields.inbound_date'),
							enableColumnFilter: false,
							filterFn: 'fuzzy',
							size: 160,
							cell: ({ getValue }) => {
								const value = getValue()
								return isValid(new Date(value)) ? (
									format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
								) : (
									<Typography variant='small' color='muted'>
										{t('ns_common:titles.unknown')}
									</Typography>
								)
							}
						})
					]
				: [])
		],
		[i18n.language, searchParams.action]
	)

	const [tableData, setTableData] = useState<IDefectiveGoods[]>([])

	useDeepCompareEffect(() => {
		if (isEqual(data, tableData)) return
		const newData = Array.isArray(data) ? data : []
		setTableData(newData)
		setScannedEpcs(newData.map((item) => item.epc))
	}, [data, searchParams.action])

	const table = useReactTable<IDefectiveGoods>({
		columns,
		data: tableData,
		initialState: {
			columnVisibility: {
				inbound_date: searchParams.action === RFIDDataType.OUTBOUND
			}
		},
		columnResizeMode: 'onChange',
		manualFiltering: true,
		enableColumnFilters: true,
		enableHiding: true,
		enableColumnResizing: true,
		getRowId: (row: IDefectiveGoods) => row.epc,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		filterFns: {
			fuzzy: fuzzyFilter,
			inDateRange: null
		}
	})

	const { rows } = table.getRowModel()
	const totalColumns = table.getAllColumns().length

	const computedColumnSizes = useMemo(() => {
		const headers = table.getFlatHeaders()
		const columnSizes: Record<string, string> = {}
		headers.forEach((header) => {
			columnSizes[`--header-${header.id}-size`] = header.getSize() + 'px'
			columnSizes[`--column-${header.column.id}-size`] = header.column.getSize() + 'px'
		})
		return columnSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const estimateSize = useMemoizedFn(() => 40)
	const scrollToFn = useScrollToFn(containerRef)

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		getScrollElement,
		estimateSize,
		scrollToFn,
		overscan: 5
	})

	useEffect(() => {
		table.setColumnVisibility({
			...table.getState().columnVisibility,
			inbound_date: searchParams.action === RFIDDataType.OUTBOUND
		})
	}, [searchParams.action])

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(rowVirtualizer)

	const shouldMemoize = rowVirtualizer.isScrolling || table.getState().columnSizingInfo.isResizingColumn

	return (
		<DataTableContainer>
			<DataTableScrollArea
				ref={containerRef}
				style={
					{
						'--row-height': `${estimateSize()}px`,
						...computedColumnSizes
					} as React.CSSProperties
				}>
				<Table className='table-fixed border-separate border-spacing-0 divide-y'>
					{shouldMemoize ? <MemoizedDataTableHeader table={table} /> : <DataTableHeader table={table} />}
					{isLoading ? (
						<DataTableLoading columns={table.getAllColumns()} />
					) : rows.length === 0 ? (
						<DataTableEmpty colSpan={totalColumns} />
					) : (
						<TableBody style={{ height: rowVirtualizer.getTotalSize() + 'px' }}>
							{/* Top padding */}
							{before > 0 && (
								<TableRow style={{ height: before }}>
									<TableCell colSpan={totalColumns} />
								</TableRow>
							)}
							{rowVirtualizer.getVirtualItems().map((virtualRow) => {
								const row = rows[virtualRow.index]
								return shouldMemoize ? (
									<MemoizedDataTableRow key={row.id} row={row} virtualRow={virtualRow} />
								) : (
									<DataTableRow key={row.id} row={row} virtualRow={virtualRow} />
								)
							})}
							{/* Bottom padding */}
							{after > 0 && (
								<TableRow style={{ height: after }}>
									<TableCell colSpan={totalColumns} />
								</TableRow>
							)}
						</TableBody>
					)}
				</Table>
			</DataTableScrollArea>
			<DataTableFooter onResetColumnFilter={table.resetColumnFilters} />
		</DataTableContainer>
	)
}

const DataTableContainer = tw.div`flex h-[calc(var(--outlet-wrapper-height)-var(--header-height))] flex-col justify-between divide-y divide-border`
const DataTableScrollArea = tw.div`flex-1 overflow-scroll will-change-scroll contain-strict scrollbar-track-accent/20`

export default EpcTable
