import type { FactoryCode } from '@common/constants/enums'
import env from '@common/utils/env'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import useMediaQuery from '@hooks/use-media-query'
import useQueryParams from '@hooks/use-query-params'
import { useQueryClient } from '@tanstack/react-query'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsQueryKey } from '../../hooks/use-defective-goods-request'

import { TRANSLATED_FACTORY } from '@common/constants/constants'
import { DefectiveGoodsService } from '@features/defective-goods/services/defective-goods.service'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'

import { useState } from 'react'
import type { IDefectiveGoodsInboundReport } from '../../types'

const TOAST_ID = 'download_defective_goods_inbound_report'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const [isDownloading, setIsDownloading] = useState<boolean>(false)
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const { searchParams } = useQueryParams()

	const queryData = queryClient.getQueryData<ResponseBody<IDefectiveGoodsInboundReport>>([
		DefectiveGoodsQueryKey.DEFECTIVE_GOODS_INBOUND_REPORT,
		pick(searchParams, ['date:eq'])
	])

	const handleDownloadReport = async () => {
		const factory = env<FactoryCode>('VITE_APP_TENANT')
		toast.loading(t('ns_common:notification.downloading'), { id: TOAST_ID })
		const translatedFactory = t(TRANSLATED_FACTORY[factory], { ns: 'ns_common', defaultValue: factory })
		setIsDownloading(true)

		try {
			const blob = await DefectiveGoodsService.downloadInboundReport(searchParams)
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
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<Button
			disabled={isDownloading || !Array.isArray(queryData?.metadata) || queryData?.metadata?.length === 0}
			size={isLargeScreen ? 'default' : 'icon'}
			variant={isLargeScreen ? 'default' : 'outline'}
			onClick={() => handleDownloadReport()}>
			<Icon name='Download' />
			{isLargeScreen && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
