import TableCellText from '@components/addons/tanstack-table/components/table-cell-text'
import { fuzzyFilter } from '@components/addons/tanstack-table/utils/fuzzy-filter.util'
import { Typography } from '@components/customs/typography'
import { Icon } from '@components/ui/icon'
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table'
import { TRANSLATED_DEFECTIVE_CATEGORY } from '@features/defective-goods/constants/enums'
import { useDefectiveCategoryList } from '@features/defective-goods/hooks/use-defective-category-list'
import { useGetCanInoutboundEpcQuery } from '@features/defective-goods/hooks/use-defective-goods-request'
import { useFilterQuery } from '@features/defective-goods/hooks/use-filter-query'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import { StockFlow } from '@features/finished-goods/constants/enums'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import useScrollToFn from '@hooks/use-scroll-fn'
import useVirtualScrollPadding from '@hooks/use-virtual-scroll-padding'
import {
	createColumnHelper,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn } from 'ahooks'
import { format, isValid } from 'date-fns'
import { capitalize } from 'lodash-es'
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import DataTableEmpty from './table-empty'
import DataTableFooter from './table-footer'
import { DataTableHeader, MemoizedDataTableHeader } from './table-header'
import DataTableLoading from './table-loading'
import { DataTableRow, MemoizedDataTableRow } from './table-row'

const EpcTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)
	const { searchParams } = useFilterQuery()
	const columnHelper = createColumnHelper<IDefectiveGoods>()
	const defectiveCategoryList = useDefectiveCategoryList()

	const { data: specs } = useGetProductSpecsQuery()

	const { data, isLoading, isPlaceholderData, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useGetCanInoutboundEpcQuery()

	const columns = useMemo(
		() => [
			columnHelper.accessor('epc', {
				header: 'EPC',
				enableColumnFilter: false,
				enableSorting: false,
				enablePinning: false,
				enableResizing: true,
				filterFn: 'includesString',
				meta: { align: 'left' },
				size: 180,
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
					return t(TRANSLATED_DEFECTIVE_CATEGORY[value], {
						ns: 'ns_inoutbound',
						defaultValue: t('ns_common:titles.unknown')
					})
				}
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: {
					align: 'left',
					filterVariant: 'select',
					facetedUniqueValues: [...new Set(specs?.map((item) => item.brand_name))].map((item) => ({
						label: item,
						value: item
					}))
				},
				size: 180,
				minSize: 150,
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
					filterVariant: 'combobox'
				},
				size: 180,
				minSize: 150,
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
					filterVariant: 'combobox'
				},
				size: 180,
				minSize: 150,
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
					filterVariant: 'combobox',
					facetedUniqueValues: [...new Set(specs?.map((item) => item.factory_shoes_style))]
						.map((item) => ({ label: item, value: item }))
						.sort((shoeStyle1, shoeStyle2) => shoeStyle1.label.localeCompare(shoeStyle2.label))
				},
				size: 180,
				minSize: 150,
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'equals',
				meta: {
					filterVariant: 'combobox',
					facetedUniqueValues: [
						...new Set(specs?.flatMap((item) => item.product_variants.map((pv) => pv.color_sn)))
					]
						.map((item) => ({
							label: item,
							value: item
						}))
						.sort((color1, color2) => color1.label.localeCompare(color2.label))
				},
				size: 180,
				minSize: 150,
				cell: TableCellText
			}),
			columnHelper.accessor('size_numcode', {
				header: 'Size',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'includesString',
				size: 150,
				minSize: 120,
				cell: TableCellText,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: [
						...new Set(specs?.flatMap((item) => item.product_variants.flatMap((pv) => pv.sizes)))
					]
						.map((item) => ({
							label: item,
							value: item
						}))
						.sort((color1, color2) => color1.label.localeCompare(color2.label))
				}
			}),

			columnHelper.accessor('unit', {
				header: t('ns_common:common_fields.unit'),
				enableColumnFilter: true,
				enableSorting: true,
				enableResizing: true,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: [
						{ label: capitalize(t('ns_common:unit.pcs')), value: 'pcs' },
						{ label: capitalize(t('ns_common:unit.prs')), value: 'prs' }
					]
				},
				cell: ({ getValue }) => {
					const value = getValue()
					return capitalize(t(`ns_common:unit.${value}`, { defaultValue: value }))
				}
			}),
			...(searchParams.action === StockFlow.OUTBOUND
				? [
						columnHelper.accessor('inbound_at', {
							header: t('ns_erp:fields.inbound_date'),
							enableColumnFilter: false,
							filterFn: 'fuzzy',
							size: 180,
							maxSize: 180,
							cell: ({ getValue }) => {
								const value = getValue()
								return isValid(new Date(value)) ? (
									format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
								) : (
									<Typography color='muted' variant='small'>
										{t('ns_common:titles.unknown')}
									</Typography>
								)
							}
						})
					]
				: [])
		],
		[i18n.language, searchParams.action, specs]
	)

	const table = useReactTable<IDefectiveGoods>({
		columns,
		data: Array.isArray(data?.docs) ? data.docs : [],
		autoResetPageIndex: false,
		initialState: {
			columnVisibility: {
				inbound_date: searchParams.action === StockFlow.OUTBOUND
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
			inDateRange: null!
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
	const estimateSize = useMemoizedFn(() => 36)
	const scrollToFn = useScrollToFn(containerRef)

	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		getScrollElement,
		estimateSize,
		scrollToFn,
		overscan: 5
	})

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

		if (!lastItem) {
			return
		}

		if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
			console.log('Fetching next page, last item index:', lastItem.index)
			fetchNextPage()
		}
	}, [hasNextPage, fetchNextPage, rows.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()])

	useEffect(() => {
		table.setColumnVisibility({
			...table.getState().columnVisibility,
			inbound_date: searchParams.action === StockFlow.OUTBOUND
		})
	}, [searchParams.action])

	const { before, after } = useVirtualScrollPadding<HTMLDivElement, HTMLTableRowElement>(rowVirtualizer)

	const shouldMemoize = rowVirtualizer.isScrolling || table.getState().columnSizingInfo.isResizingColumn

	return (
		<DataTableContainer>
			<DataTableScrollArea
				ref={containerRef}
				style={{ '--row-height': `${estimateSize()}px`, ...computedColumnSizes } as React.CSSProperties}>
				<Table
					className='table-auto border-separate border-spacing-0 divide-y'
					style={{ minWidth: table.getTotalSize() + 'px' }}>
					{shouldMemoize ? <MemoizedDataTableHeader table={table} /> : <DataTableHeader table={table} />}
					{!isPlaceholderData && isLoading ? (
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

							{isFetchingNextPage && (
								<TableRow>
									<TableCell align='center' className='py-2 text-center sticky left-0' colSpan={totalColumns}>
										<div className='flex items-center justify-center'>
											<Icon className='animate-spin' name='LoaderCircle' />
										</div>
									</TableCell>
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
const DataTableScrollArea = tw.div`flex-1 @container-size scrollbar-thin overflow-scroll will-change-scroll contain-strict scrollbar-track-accent/20`

export default EpcTable
