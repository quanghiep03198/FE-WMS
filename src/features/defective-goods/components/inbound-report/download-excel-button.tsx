import { Button, Icon } from '@/components/ui'
import { useGetTenantByFactory } from '@/features/tenancy/hooks/use-tenacy-request'
import useMediaQuery from '@/hooks/use-media-query'
import useQueryParams from '@/hooks/use-query-params'
import { useQueryClient } from '@tanstack/react-query'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsQueryKey } from '../../hooks/use-defective-goods-request'

import { DefectiveGoodsService } from '@/features/defective-goods/services/defective-goods.service'
import useAuth from '@/hooks/use-auth'
import { TRANSLATED_FACTORY } from '@common/constants/constants'
import { useMemoizedFn } from 'ahooks'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'

import type { IDefectiveGoodsInboundReport } from '../../types'
import type { PageQueryParams } from './report-master-table'

const TOAST_ID = 'download_defective_goods_inbound_report'

const useDownloadReport = () => {
	const { searchParams } = useQueryParams<PageQueryParams>()
	const { data: currentTenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { user } = useAuth()

	return useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: TOAST_ID })
		const translatedFactory = t(TRANSLATED_FACTORY[user?.current_factory_code], { ns: 'ns_common' })

		try {
			const blob = await DefectiveGoodsService.downloadInboundReport(currentTenant?.id, searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_defective_goods_inbound_report', {
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
	const { data: currentTenant } = useGetTenantByFactory()
	const { searchParams } = useQueryParams()
	const queryClient = useQueryClient()

	const queryData = queryClient.getQueryData<ResponseBody<IDefectiveGoodsInboundReport>>([
		DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INBOUND_REPORT,
		currentTenant?.id,
		pick(searchParams, ['date:eq'])
	])

	return (
		<Button
			disabled={!Array.isArray(queryData?.metadata) || queryData?.metadata?.length === 0}
			variant={isLargeScreen ? 'default' : 'outline'}
			size={isLargeScreen ? 'default' : 'icon'}
			onClick={() => handleDownloadReport()}>
			<Icon name='Download' />
			{isLargeScreen && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
