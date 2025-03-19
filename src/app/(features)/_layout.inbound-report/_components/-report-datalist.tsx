import { useGetInboundReport } from '@/app/(features)/_apis/use-report.api'
import { factories } from '@/common/constants/constants'
import { useAuth } from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundReport } from '@/common/types/entities'
import {
	Badge,
	Button,
	DataTable,
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip
} from '@/components/ui'
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
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'
import AutoRefreshToggle from '../../_components/_shared/-auto-refresh-toggle'

export type UrlQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

const DOWNLOAD_INBOUND_REPORT_ID = 'download-inbound-report'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'date.eq': format(new Date(), 'yyyy-MM-dd'),
		'auto-refresh': false
	})
	const { data: tenants } = useGetTenantByFactory()
	const { user } = useAuth()
	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factories.join('') === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

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
				minSize: 150,
				size: 150,
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
				minSize: 150,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('mat_ecolor', {
				header: t('ns_erp:fields.mat_ecolor'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('shaping_dept_name', {
				header: t('ns_erp:fields.shaping_dept_name'),
				enableColumnFilter: true,
				enableSorting: true,
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
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 220
			}),
			columnHelper.accessor('daily_inbound_qty', {
				header: t('ns_erp:fields.daily_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 275
			}),
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 200
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
					return !isNil(order_qty) && order_qty >= 0
						? new Intl.NumberFormat().format(order_qty - accumulated_qty)
						: 0
				},
				minSize: 200
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INBOUND_REPORT_ID })
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
			toast.success(t('ns_common:notification.success'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: DOWNLOAD_INBOUND_REPORT_ID })
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
				containerProps={{
					style: { height: screen.availHeight / 1.75 }
				}}
				renderSubComponent={
					(({ row }) => {
						return <InboundReportDetailTable data={row.original?.size_run} />
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
			/>
		</Div>
	)
}

const InboundReportDetailTable: React.FC<{ data: IInboundReport['size_run'] }> = ({ data }) => {
	const { t } = useTranslation()
	return (
		<Div className='right-0 top-0 w-96 overflow-clip rounded-md border'>
			<Table className='table-fixed !border-none'>
				<TableHeader>
					<TableRow>
						<TableHead>Size</TableHead>
						<TableHead>{t('ns_erp:fields.inbound_qty')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(data) && data.length > 0 ? (
						data.map((item) => (
							<TableRow key={item.size_numcode}>
								<TableCell align='center' className='font-medium'>
									{item.size_numcode}
								</TableCell>
								<TableCell align='center' key={item.qty}>
									{item.qty}
								</TableCell>
								{data.length === 0 && <TableCell></TableCell>}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell align='center' colSpan={2} className='font-medium'>
								{t('ns_common:table.no_data')}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Div>
	)
}

InboundReportDetailTable.displayName = 'InboundReportDetailTable'

export default ReportDatalist
