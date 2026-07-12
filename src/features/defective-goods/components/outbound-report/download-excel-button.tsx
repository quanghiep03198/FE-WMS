import { Button, Icon } from '@/components/ui'
import useMediaQuery from '@/hooks/use-media-query'
import { TRANSLATED_FACTORY } from '@common/constants/constants'
import { useReportPageQueryParams } from '@features/report/hooks/use-report-page-query-params'
import { useGetTenantByFactory } from '@features/tenancy/hooks/use-tenacy-request'
import useAuth from '@hooks/use-auth'
import { useMemoizedFn } from 'ahooks'
import { saveAs } from 'file-saver'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DefectiveGoodsService } from '../../services/defective-goods.service'

const TOAST_ID = 'download_defective_goods_outbound_report'

export const useDownloadReport = () => {
	const { searchParams } = useReportPageQueryParams()
	const { data: currentTenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { user } = useAuth()

	return useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: TOAST_ID })
		const translatedFactory = t(TRANSLATED_FACTORY[user?.current_factory_code], { ns: 'ns_common' })

		try {
			const blob = await DefectiveGoodsService.downloadOutboundReport(
				currentTenant?.id,
				pick(searchParams, ['date:eq'])
			)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_defective_goods_outbound_report', {
					factory: translatedFactory,
					date: searchParams['date:eq'],
					defaultValue: null
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id: TOAST_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: TOAST_ID })
		}
	})
}

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const handleDownloadReport = useDownloadReport()

	return (
		<Button
			variant={isLargeScreen ? 'default' : 'outline'}
			size={isLargeScreen ? 'default' : 'icon'}
			onClick={() => handleDownloadReport()}>
			<Icon name='Download' />
			{isLargeScreen && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
