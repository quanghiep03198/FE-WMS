import { useGetInboundReport } from '@/app/(features)/-hooks/use-report'
import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { ReportService } from '@/services/report.service'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { isNil } from 'lodash'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AutoRefreshToggle from '../../-components/-shared/auto-refresh-toggle'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'
import InboundReportDetailTable from './report-detail-table-'
import ReportTableFooter from './report-table-footer'

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
	const { user } = useAuth()
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
							className='absolute inset-0 flex h-full w-full items-center justify-center'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='FoldVertical' stroke='hsl(var(--foreground))' />
						</button>
					</Tooltip>
				),
				size: 50,
				enableResizing: false,
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
				minSize: 120,
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
				minSize: 100,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				minSize: 100,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 100,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('shaping_dept_name', {
				header: t('ns_erp:fields.shaping_dept_name'),
				enableColumnFilter: true,
				enableSorting: true,
				size: 200,
				minSize: 200,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<EllipsisList
							threshhold={3}
							data={value.split(',').sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='outline' className='whitespace-nowrap font-normal'>
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
				minSize: 200,
				size: 200,
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
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 100,
				size: 150
			}),
			columnHelper.accessor('daily_inbound_qty', {
				header: t('ns_erp:fields.daily_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 150,
				size: 150
			}),
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 150,
				size: 150
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
				},
				minSize: 150,
				size: 150
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await ReportService.downloadInboundReport(currentTenant?.id, searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_inbound_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					date: searchParams['date.eq'],
					defaultValue: `Inbound Report ~ ${searchParams['date.eq']}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	})

	return (
		<Div className='relative'>
			<Div className='absolute left-0 top-0'>
				<AutoRefreshToggle />
			</Div>
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				enableExpanding={true}
				ref={dataTableRef}
				defaultFilterOpen
				renderSubComponent={
					(({ row }) => {
						return <InboundReportDetailTable data={row.original?.size_data} />
					}) satisfies RenderSubComponent<IInboundReport>
				}
				toolbarProps={{
					slotRight: () => (
						<Fragment>
							<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
								<Button
									size='icon'
									variant='outline'
									disabled={!data || data.length === 0}
									onClick={handleDownloadExcel}>
									<Icon name='Download' />
								</Button>
							</Tooltip>
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<Button size='icon' variant='outline' onClick={() => refetch()}>
									<Icon name='RotateCw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
				footerProps={{
					slot: () => <ReportTableFooter data={data} />
				}}
			/>
		</Div>
	)
}

export default InboundReportMasterTable
