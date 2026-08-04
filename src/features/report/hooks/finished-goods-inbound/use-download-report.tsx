import { TRANSLATED_FACTORY } from '@common/constants/constants'
import type { UrlQueryParams } from '@features/report/components/finished-goods-inbound/report-master-table'
import { ReportService } from '@features/report/services/report.service'
import { useGetTenantByFactory } from '@features/tenancy/hooks/use-tenacy-request'
import useAuth from '@hooks/use-auth'
import useQueryParams from '@hooks/use-query-params'
import { useMemoizedFn } from 'ahooks'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useDownloadReport = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>()
	const { data: currentTenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { user } = useAuth()

	return useMemoizedFn(async (reportType: 'daily-productivity' | 'assembly-productivity') => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const translatedFactory = t(TRANSLATED_FACTORY[user?.current_factory_code], { ns: 'ns_common' })
		const fallbackFileTitle =
			reportType === 'daily-productivity'
				? `Daily Inbound Report ${translatedFactory} - ${searchParams['date:eq']}`
				: `Shaping Department Productivity Report ${translatedFactory} - ${searchParams['date:eq']}`

		try {
			const blob = await ReportService.downloadInboundReport(reportType, currentTenant?.id, searchParams)
			saveAs(
				blob,
				t(
					reportType === 'daily-productivity'
						? 'ns_inoutbound:titles.file_daily_inbound_report'
						: 'ns_inoutbound:titles.file_shaping_department_productivity_report',
					{
						factory: translatedFactory,
						date: searchParams['date:eq'],
						defaultValue: fallbackFileTitle
					}
				) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	})
}
