import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { IOutboundReport } from '@/common/types/entities'
import {
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
import { ReportService } from '@/services/report.service'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

import { useGetOutboundReport } from '@/app/(features)/_apis/use-report.api'
import { factories } from '@/common/constants/constants'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { capitalize, isNil } from 'lodash'
import DatePickerFilter from './-date-picker-filter'

const DOWNLOAD_INBOUND_REPORT_ID = 'download-inbound-report'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'date.eq': string }>()
	const { data: tenants } = useGetTenantByFactory()
	const { user } = useAuth()
	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factories.join('') === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

	const { data, isLoading, refetch } = useGetOutboundReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	const columnHelper = createColumnHelper<IOutboundReport>()

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

			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 150,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('mat_code', {
				header: t('ns_erp:fields.mat_code'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 150,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('mat_ecolor', {
				header: t('ns_erp:fields.mat_ecolor'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => {
					const value = getValue()
					if (value) return capitalize(value)
					return 'Unknown'
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
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 250
			}),

			columnHelper.display({
				id: 'missing_qty',
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					const { order_qty, accumulated_qty } = row.original
					return !isNil(order_qty) && order_qty >= 0
						? new Intl.NumberFormat().format(order_qty - accumulated_qty)
						: 0
				},
				minSize: 200
			}),
			columnHelper.accessor('daily_outbound_qty', {
				header: t('ns_erp:fields.daily_outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 250
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		try {
			const blob = await ReportService.downloadOutboundReport(currentTenant?.id, searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_outbound_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					date: searchParams['date.eq'],
					defaultValue: `Outbound Report ~ ${format(new Date(), 'yyyy-MM-dd')}.xlsx`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: DOWNLOAD_INBOUND_REPORT_ID })
		}
	}

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			renderSubComponent={
				(({ row }) => {
					return <OutboundReportDetailTable data={row.original?.size_run} />
				}) satisfies RenderSubComponent<IOutboundReport>
			}
			toolbarProps={{
				slotLeft: () => isSmallScreen && <DatePickerFilter />,
				slotRight: () => (
					<Fragment>
						<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
							<Button
								size='icon'
								variant='outline'
								onClick={handleDownloadExcel}
								disabled={!data || data.length === 0}>
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
	)
}

const OutboundReportDetailTable: React.FC<{ data: IOutboundReport['size_run'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<Div className='w-1/4 overflow-clip rounded-md border'>
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
								<TableCell align='center' className='w-10' key={item.qty}>
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

export default ReportDatalist
