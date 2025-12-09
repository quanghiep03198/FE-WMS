import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { useMemoizedFn } from 'ahooks'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { pick } from 'lodash-es'
import { useReportPageQueryParams } from '../../../-hooks/use-report-page-query-params'
import { useGetTenantByFactory } from '../../../-hooks/use-tenacy-asm'

const TOAST_ID = 'download_defective_goods_outbound_report'

export const useDownloadReport = () => {
	const { searchParams } = useReportPageQueryParams()
	const { data: currentTenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { user } = useAuth()

	return useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: TOAST_ID })
		const translatedFactory = t(factories[user.company_code], { ns: 'ns_common' })

		try {
			const blob = await DefectiveGoodsService.downloadOutboundReport(
				currentTenant?.id,
				pick(searchParams, ['date.eq'])
			)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_defective_goods_outbound_report', {
					factory: translatedFactory,
					date: searchParams['date.eq'],
					defaultValue: null
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id: TOAST_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: TOAST_ID })
		}
	})
}
