import { factories } from '@/common/constants/constants'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { isEmpty, isNil } from 'lodash'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDownloadReport } from '../-hooks/use-download-report'
import { useGetInboundReport } from '../-hooks/use-inbound-report-asm'
import AutoRefreshToggle from '../../-components/-shared/auto-refresh-toggle'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'
import DownloadExcelDropdown from './download-excel-dropdown'
import InboundReportDetailTable from './report-detail-table'
import ReportTableSummary from './report-table-summary'

export type UrlQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

const InboundReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'date.eq': format(new Date(), 'yyyy-MM-dd'),
		'auto-refresh': false
	})
	const { data: currentTenant } = useGetTenantByFactory()
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const { data, isLoading, refetch } = useGetInboundReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IInboundReport>>(null)
	const columnHelper = createColumnHelper<IInboundReport>()

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
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
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
			columnHelper.accessor('factory_code', {
				header: t('ns_common:common_fields.factory_code'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				size: 120,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(factories).map(([key, val]) => ({
						label: t(val, { ns: 'ns_common', defaultValue: val }),
						value: key
					}))
				},
				cell: ({ getValue }) => {
					const factoryCode = getValue()
					return factoryCode
						? t(factories[factoryCode], { ns: 'ns_common', defaultValue: factoryCode })
						: 'Unknown'
				}
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('shaping_dept_name', {
				header: t('ns_erp:fields.shaping_dept_name'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const value = getValue()
					const data =
						typeof value === 'string' && !isEmpty(value)
							? value.split(',').sort((a, b) => a.localeCompare(b))
							: []
					return (
						<EllipsisList
							threshhold={3}
							data={data}
							template={({ data }) => (
								<Badge variant='outline' className='max-h-fit whitespace-nowrap font-normal'>
									{data}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('storage', {
				header: t('ns_warehouse:fields.storage_name'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<EllipsisList
							threshhold={3}
							data={value.split(',').sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('daily_inbound_qty', {
				header: t('ns_erp:fields.daily_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.display({
				id: 'missing_qty',
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					const { order_qty, accumulated_qty } = row.original
					return !isNil(order_qty) && order_qty > 0 ? formatIntlNumber(order_qty - accumulated_qty) : 0
				}
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useDownloadReport()

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			enableColumnResizing={true}
			ref={dataTableRef}
			containerProps={{ className: 'h-[60vh]' }}
			renderSubComponent={
				(({ row }) => {
					return <InboundReportDetailTable data={row.original?.size_data} />
				}) satisfies RenderSubComponent<IInboundReport>
			}
			toolbarProps={{
				slotLeft: () => <AutoRefreshToggle />,
				slotRight: () => (
					<Fragment>
						{!isLargeScreen && <DownloadExcelDropdown />}
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='outline' onClick={() => refetch()}>
								<Icon name='RotateCw' />
							</Button>
						</Tooltip>
					</Fragment>
				)
			}}
			footerProps={{
				slot: () => (
					<Div className='flex w-full items-center justify-between p-2 md:flex-col'>
						<Div className='hidden md:block'>
							<Button onClick={() => handleDownloadExcel('shaping-department-productivity')}>
								<Icon name='FileDown' size={18} /> {t('ns_erp:fields.shaping_dept_productivity')}
							</Button>
						</Div>
						<ReportTableSummary data={data} />
					</Div>
				)
			}}
		/>
	)
}

export default InboundReportMasterTable
