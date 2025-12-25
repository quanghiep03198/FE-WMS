import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import useVirtualScrollPadding from '@/common/hooks/use-virtual-scroll-padding'
import { Div, Table, TableBody, TableCell, TableRow } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import React, { useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../-hooks/use-filter-query'
import { DefectiveCategoryI18n } from '../../../-constants'
import { useReaderPlaygroundStore } from '../../../-contexts/rfid-reader-playground.context'
import { useDefectiveCategoryList } from '../../../-hooks/use-defective-category-list'
import { useGetCanInboundEpcQuery } from '../../../-hooks/use-defective-goods-asm'
import DataTableEmpty from './table-empty'
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
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { align: 'left' },
				filterFn: 'includesString',
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
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
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
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			...(searchParams.action === RFIDDataType.OUTBOUND
				? [
						columnHelper.accessor('inbound_date', {
							header: t('ns_erp:fields.inbound_date'),
							enableColumnFilter: false,
							filterFn: 'fuzzy',
							cell: TableCellText
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
		manualFiltering: true,
		initialState: {
			columnVisibility: {
				inbound_date: searchParams.action === RFIDDataType.OUTBOUND
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableHiding: true,
		filterFns: null
	})

	const { rows } = table.getRowModel()

	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const estimateSize = useMemoizedFn(() => 40)

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		getScrollElement,
		estimateSize,
		overscan: 5
	})

	// 	useEffect(()=>{
	// table.setColumnVisibility({...table.getState().columnVisibility, inbound_date: searchParams.action === RFIDDataType.OUTBOUND})
	// 	},[searchParams.action])

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(rowVirtualizer)

	return (
		<Div ref={containerRef} className='h-[calc(var(--outlet-wrapper-height)-var(--header-height))] overflow-scroll'>
			<Table className='table-auto border-collapse border-spacing-0'>
				{rowVirtualizer.isScrolling ? (
					<MemoizedDataTableHeader headerGroups={table.getHeaderGroups()} />
				) : (
					<DataTableHeader headerGroups={table.getHeaderGroups()} />
				)}
				{isLoading ? (
					<DataTableLoading columns={table.getAllColumns()} />
				) : rows.length === 0 ? (
					<DataTableEmpty colSpan={table.getAllColumns().length} />
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
							return rowVirtualizer.isScrolling ? (
								<MemoizedDataTableRow key={row.id} row={row} />
							) : (
								<DataTableRow key={row.id} row={row} />
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
