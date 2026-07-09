import { useGetTenantByFactory } from '@/app/(features)/-hooks/use-tenacy-asm'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Icon } from '@/components/ui'
import type { IDefectiveGoodsInboundReport } from '@/services/defective-goods.service'
import { useQueryClient } from '@tanstack/react-query'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { useDownloadReport } from '../-hooks/use-download-report'
import { DefectiveGoodsQueryKey } from '../../-hooks/use-defective-goods-asm'

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
