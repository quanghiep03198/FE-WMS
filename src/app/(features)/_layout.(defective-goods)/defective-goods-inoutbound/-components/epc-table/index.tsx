import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import useVirtualScrollPadding from '@/common/hooks/use-virtual-scroll-padding'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Button, Div, Icon, Table, TableBody, TableCell, TableRow, Typography } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import {
	createColumnHelper,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	TableOptions,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { format, isValid } from 'date-fns'
import { omit } from 'lodash-es'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../-hooks/use-filter-query'
import { DefectiveCategoryI18n } from '../../../-constants'
import { useReaderPlaygroundStore } from '../../../-contexts/rfid-reader-playground.context'
import { useDefectiveCategoryList } from '../../../-hooks/use-defective-category-list'
import { useGetCanInboundEpcQuery } from '../../../-hooks/use-defective-goods-asm'
import InoutboundStrategySelect from '../inoutbound-strategy-select'
import DataTableEmpty from './table-empty'
import { DataTableHeader, MemoizedDataTableHeader } from './table-header'
import DataTableLoading from './table-loading'
import { DataTableRow, MemoizedDataTableRow } from './table-row'

const EpcTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)
	const { searchParams, removeParam } = useFilterQuery()
	const { setScannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'setScannedEpcs')
	const columnHelper = createColumnHelper<IDefectiveGoods>()
	const defectiveCategoryList = useDefectiveCategoryList()

	const { data, isLoading } = useGetCanInboundEpcQuery()

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

	const table = useReactTable({
		columns,
		data: tableData,
		initialState: {
			columnVisibility: {
				inbound_date: searchParams.action === RFIDDataType.OUTBOUND
			}
		},
		manualFiltering: true,
		enableColumnFilters: true,
		enableHiding: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	} as unknown as TableOptions<IDefectiveGoods>)

	const { rows } = table.getRowModel()
	const totalColumns = table.getAllColumns().length

	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const estimateSize = useMemoizedFn(() => 42)

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		getScrollElement,
		estimateSize,
		overscan: 5
	})

	useEffect(() => {
		table.setColumnVisibility({
			...table.getState().columnVisibility,
			inbound_date: searchParams.action === RFIDDataType.OUTBOUND
		})
	}, [searchParams.action])

	const handleClearFilters = () => {
		for (const key in searchParams) {
			if (key === 'action') continue
			removeParam(key)
		}
		table.resetColumnFilters()
		table.resetGlobalFilter()
	}

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(rowVirtualizer)

	return (
		<Div className='flex h-[calc(var(--outlet-wrapper-height)-var(--header-height))] flex-col justify-between divide-y divide-border will-change-scroll contain-strict'>
			<Div
				ref={containerRef}
				className='flex-1 overflow-scroll will-change-scroll contain-strict'
				style={
					{
						'--row-height': `${estimateSize()}px`
					} as React.CSSProperties
				}>
				<Table className='table-fixed border-separate border-spacing-0 divide-y'>
					{rowVirtualizer.isScrolling ? (
						<MemoizedDataTableHeader table={table} />
					) : (
						<DataTableHeader table={table} />
					)}
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
								return rowVirtualizer.isScrolling ? (
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
			</Div>
			<Div
				role='row'
				className='sticky bottom-0 z-50 mt-auto flex h-[var(--row-height)] items-center justify-between gap-x-2 bg-table-head px-4 py-2'>
				<Div className='@7xl:hidden'>
					<InoutboundStrategySelect />
				</Div>
				<Button
					variant='destructive'
					size='sm'
					disabled={Object.keys(omit(searchParams, ['action'])).length === 0}
					onClick={handleClearFilters}>
					<Icon name='FunnelX' /> {t('ns_common:actions.clear_filter')}
				</Button>
				<Typography role='cell' className='ml-auto text-right font-medium'>
					{`${t('ns_common:common_fields.total')}: ${Array.isArray(data) ? formatIntlNumber(data.length) : 0}`}
				</Typography>
			</Div>
		</Div>
	)
}

export default EpcTable
