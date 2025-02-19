import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { IOutboundReport } from '@/common/types/entities'
import { Button, DataTable, Icon, Tooltip } from '@/components/ui'
import { ReportService } from '@/services/report.service'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

import { useGetOutboundReport } from '@/app/(features)/_apis/use-report.api'
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

	console.log('ahihhhi')

	const { data, isLoading, refetch } = useGetOutboundReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	const columnHelper = createColumnHelper<IOutboundReport>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200
			}),
			columnHelper.accessor('mat_code', {
				header: t('ns_erp:fields.mat_code'),
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				minSize: 200
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				minSize: 200
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 250
			}),
			columnHelper.accessor('outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 250
			}),
			columnHelper.accessor('outbound_date', {
				header: t('ns_erp:fields.outbound_date'),
				enableColumnFilter: true,
				enableSorting: true,
				enableResizing: true,
				cell: ({ getValue }) => {
					const value = getValue()
					return format(value, 'yyyy-MM-dd')
				}
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		try {
			const blob = await ReportService.downloadOutboundReport(currentTenant?.id, searchParams)
			saveAs(blob, `Outbound Report ~ ${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
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
			toolbarProps={{
				slotLeft: () => isSmallScreen && <DatePickerFilter />,
				slotRight: () => (
					<Fragment>
						<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='outline' onClick={handleDownloadExcel}>
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

export default ReportDatalist
