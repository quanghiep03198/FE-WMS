import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { ReportService } from '@/services/report.service'
import { useMemoizedFn } from 'ahooks'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { UrlQueryParams } from '../-components/report-master-table'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'

export const useDownloadReport = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>()
	const { data: currentTenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { user } = useAuth()

	return useMemoizedFn(async (reportType: 'daily-productivity' | 'shaping-department-productivity') => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const translatedFactory = t(factories[user?.factory_code], { ns: 'ns_common' })
		const fallbackFileTitle =
			reportType === 'daily-productivity'
				? `Daily Inbound Report ${translatedFactory} - ${searchParams['date.eq']}`
				: `Shaping Department Productivity Report ${translatedFactory} - ${searchParams['date.eq']}`

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
						date: searchParams['date.eq'],
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
