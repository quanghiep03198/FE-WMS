import { Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { ReportService } from '@/services/report.service'
import { TRANSLATED_FACTORY } from '@common/constants/constants'
import { PresetBreakPoints } from '@common/constants/enums'
import type { IOutboundReport } from '@common/types/entities'
import formatIntlNumber from '@common/utils/format-intl-number'
import AutoRefreshToggle from '@components/shared/auto-refresh-toggle'
import DatePickerFilter from '@components/shared/date-picker-filter'
import useAuth from '@hooks/use-auth'
import useMediaQuery from '@hooks/use-media-query'
import useQueryParams from '@hooks/use-query-params'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick } from 'lodash-es'
import { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetOutboundReport } from '../-hooks/use-outbound-report-asm'
import { useGetTenantByFactory } from '../../../../features/tenancy/hooks/use-tenacy-request'
import OutboundReportDetailTable from './report-detail-table'
import ReportTableSummary from './report-table-footer'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'date:eq': string; 'auto-refresh': number | false }>()
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
							className='text-muted-foreground hover:text-foreground absolute inset-0 flex h-full w-full items-center justify-center transition-colors duration-200'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableResizing: false,
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
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableGlobalFilter: true,
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
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
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('missing_qty', {
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
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
					factory: t(TRANSLATED_FACTORY[user?.current_factory_code], { ns: 'ns_common' }),
					date: searchParams['date:eq'],
					defaultValue: `Outbound Report ~ ${format(new Date(), 'yyyy-MM-dd')}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	const renderTableFooter = useCallback(() => <ReportTableSummary data={data} />, [data])

	return (
		<Div as='section' className='relative'>
			<Div aria-description='Auto refresh toggle' className='absolute top-0 left-0'>
				<AutoRefreshToggle />
			</Div>
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				enableExpanding={true}
				getRowId={(originalRow: IOutboundReport) => originalRow.po}
				renderSubComponent={({ row }) => {
					const data = pick(row.original as IOutboundReport, ['detail', 'overall'])
					return <OutboundReportDetailTable {...data} />
				}}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 14rem)' }
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
									<Icon name='RefreshCcw' />
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
