import formatIntlNumber from '@common/utils/format-intl-number'
import AutoRefreshToggle from '@components/shared/auto-refresh-toggle'
import SizeTable from '@components/shared/size-table'
import { Button, DataTable, Icon, Tooltip } from '@components/ui'
import TableCellText from '@components/ui/@react-table/components/table-cell-text'
import { ROW_EXPANSION_COLUMN_ID } from '@components/ui/@react-table/constants'
import type { RenderSubComponent } from '@components/ui/@react-table/types'
import ReportTableSummary from '@features/defective-goods/components/report-table-footer'
import { DefectiveGoodsOutboundPurpose, TRANSLATED_DEFECTIVE_CATEGORY } from '@features/defective-goods/constants/enums'
import { useDefectiveCategoryList } from '@features/defective-goods/hooks/use-defective-category-list'
import { useGetDefectiveGoodsOutboundReportQuery } from '@features/defective-goods/hooks/use-defective-goods-request'
import { useGetCategoriesQty } from '@features/defective-goods/hooks/use-get-category-qty'
import useMediaQuery from '@hooks/use-media-query'
import type { Table as TTable } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { lowerCase } from 'lodash-es'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { IDefectiveGoodsOutboundReport } from '../../types'
import DownloadExcelButton from './download-excel-button'

const InboundReportMasterTable: React.FC = () => {
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const { data, isLoading, refetch } = useGetDefectiveGoodsOutboundReportQuery()
	const summaryData = useGetCategoriesQty(data)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IDefectiveGoodsOutboundReport>>(null)
	const columnHelper = createColumnHelper<IDefectiveGoodsOutboundReport>()
	const defectiveCategoryList = useDefectiveCategoryList()

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: ({ table }) => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='text-muted-foreground hover:text-foreground absolute inset-0 flex h-full w-full items-center justify-center transition-colors duration-200'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableHiding: false,
				cell: ({ row, table }) => (
					<button
						className='absolute inset-0 flex h-full w-full items-center justify-center'
						onClick={() => {
							table.toggleAllRowsExpanded(false)
							row.toggleExpanded(!row.getIsExpanded())
						}}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</button>
				)
			}),

			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			columnHelper.accessor('sewing_line', {
				header: t('ns_erp:fields.sewing_line'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('assembly_line', {
				header: t('ns_erp:fields.assembly_line'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'includesString',
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
					return t(TRANSLATED_DEFECTIVE_CATEGORY[value], {
						ns: 'ns_inoutbound',
						defaultValue: t('ns_common:titles.unknown')
					})
				}
			}),
			columnHelper.accessor('shoe_source', {
				header: t('ns_erp:fields.shoe_source'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			columnHelper.accessor('daily_outbound_qty', {
				header: t('ns_erp:fields.daily_outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('outbound_purpose', {
				header: t('ns_erp:fields.outbound_purpose'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: [
						{
							label: t('ns_inoutbound:inoutbound_actions.shipping'),
							value: DefectiveGoodsOutboundPurpose.SHIPPING
						},
						{
							label: t('ns_inoutbound:inoutbound_actions.downgrade'),
							value: DefectiveGoodsOutboundPurpose.DOWNGRADE
						},
						{
							label: t('ns_inoutbound:inoutbound_actions.lab'),
							value: DefectiveGoodsOutboundPurpose.LAB
						},
						{
							label: t('ns_inoutbound:inoutbound_actions.ruin'),
							value: DefectiveGoodsOutboundPurpose.RUIN
						}
					]
				},
				filterFn: 'arrIncludes',
				cell: ({ getValue }) => {
					const value = lowerCase(getValue())
					return t(`ns_inoutbound:inoutbound_actions.${value}`, { defaultValue: null })
				}
			})
		],
		[i18n.language]
	)

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			enableColumnResizing={true}
			ref={dataTableRef}
			containerProps={{
				style: { height: 'calc(var(--outlet-wrapper-height) - 12rem - 2 * var(--row-height))' }
			}}
			initialState={{
				columnPinning: {
					left: [ROW_EXPANSION_COLUMN_ID],
					right: ['daily_outbound_qty']
				}
			}}
			renderSubComponent={
				(({ row }) => {
					return <SizeTable data={row.original?.size_data} />
				}) satisfies RenderSubComponent<IDefectiveGoodsOutboundReport>
			}
			toolbarProps={{
				slotLeft: () => <AutoRefreshToggle />,
				slotRight: () => (
					<Fragment>
						{!isLargeScreen && <DownloadExcelButton />}
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='outline' onClick={() => refetch()}>
								<Icon name='RefreshCcw' />
							</Button>
						</Tooltip>
					</Fragment>
				)
			}}
			footerProps={{
				slot: () => <ReportTableSummary summaryData={summaryData} />
			}}
		/>
	)
}

export default InboundReportMasterTable
