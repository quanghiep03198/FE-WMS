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
		try {
			const blob = await ReportService.downloadInboundReport(reportType, currentTenant?.id, searchParams)
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
}
