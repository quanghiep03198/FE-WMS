import { factories } from '@/common/constants/constants'
import { useAuth } from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import { Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { ReportService } from '@/services/report.service'
import { createColumnHelper, type Table as TTable } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick, sortBy } from 'lodash'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetMonthlyInventoryReport } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'
import AutoRefreshToggle from '../../_components/_shared/-auto-refresh-toggle'
import { InventoryReportDetailTable } from './-report-detail-table'

export type UrlQueryParams = {
	'month.eq': string
	'auto-refresh': number | false
}

export const InventoryReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'month.eq': format(new Date(), 'yyyy-MM'),
		'auto-refresh': false
	})
	const { user } = useAuth()
	const { data: tenants } = useGetTenantByFactory()
	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factory === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

	const { data, isLoading, refetch } = useGetMonthlyInventoryReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IMonthlyInventoryReport>>(null)
	const columnHelper = createColumnHelper<IMonthlyInventoryReport>()

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
							className='flex h-full w-full items-center justify-center'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='FoldVertical' stroke='hsl(var(--foreground))' />
						</button>
					</Tooltip>
				),
				size: 50,
				enableResizing: false,
				meta: {
					align: 'center'
				},
				cell: ({ row, table }) => (
					<button
						className='flex h-full w-full items-center justify-center'
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
				minSize: 150,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('init_inv_qty', {
				header: t('ns_erp:fields.total_init_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('total_instock_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('total_outstock_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('actual_inv_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('final_inv_qty', {
				header: t('ns_erp:fields.final_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await ReportService.downloadInventoryReport(currentTenant?.id, pick(searchParams, 'month.eq'))
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_monthly_inventory_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					month: searchParams['month.eq'],
					defaultValue: `Monthly Inventory Report ~ ${searchParams['month.eq']}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	})

	return (
		<Div className='relative space-y-10'>
			<Div className='absolute left-0 top-0'>
				<AutoRefreshToggle />
			</Div>
			<DataTable
				ref={dataTableRef}
				columns={columns}
				data={data}
				loading={isLoading}
				enableExpanding={true}
				containerProps={{
					style: { height: screen.availHeight / 1.75 }
				}}
				renderSubComponent={
					(({ row }) => {
						return <InventoryReportDetailTable data={sortBy(row.original?.size_data, 'size_numcode')} />
					}) satisfies RenderSubComponent<IMonthlyInventoryReport>
				}
				toolbarProps={{
					slotRight: () => (
						<Fragment>
							<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
								<Button
									size='icon'
									variant='outline'
									disabled={!data || data.length === 0}
									onClick={() => handleDownloadExcel()}>
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
			/>
		</Div>
	)
}

InventoryReportMasterTable.displayName = 'InventoryReportDataTable'
