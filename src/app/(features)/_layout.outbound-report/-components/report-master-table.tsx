import { useGetOutboundReport } from '@/app/(features)/-hooks/use-report'
import { factories } from '@/common/constants/constants'
import { PresetBreakPoints } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { IOutboundReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ReportService } from '@/services/report.service'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick } from 'lodash'
import { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AutoRefreshToggle from '../../-components/-shared/auto-refresh-toggle'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'
import DatePickerFilter from './date-picker-filter'
import OutboundReportDetailTable from './report-detail-table'
import ReportTableFooter from './report-table-footer'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'date.eq': string; 'auto-refresh': number | false }>()
	const { user } = useAuth()
	const { data: currentTenant } = useGetTenantByFactory()

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
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
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
			columnHelper.accessor('po', {
				header: 'PO',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 100,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 100
			}),
			columnHelper.accessor('daily_outbound_qty', {
				header: t('ns_erp:fields.daily_outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 100
			}),
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue()),
				minSize: 100
			}),
			columnHelper.accessor('missing_qty', {
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await ReportService.downloadOutboundReport(currentTenant?.id, searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_outbound_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					date: searchParams['date.eq'],
					defaultValue: `Outbound Report ~ ${format(new Date(), 'yyyy-MM-dd')}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	const renderTableFooter = useCallback(() => <ReportTableFooter data={data} />, [data])

	return (
		<Div as='section' className='relative'>
			<Div aria-description='Auto refresh toggle' className='absolute left-0 top-0'>
				<AutoRefreshToggle />
			</Div>
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				enableExpanding={true}
				renderSubComponent={({ row }) => {
					const data = pick(row.original, ['detail', 'overall'])
					return <OutboundReportDetailTable {...data} />
				}}
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
				footerProps={{
					slot: renderTableFooter
				}}
			/>
		</Div>
	)
}

export default ReportDatalist
