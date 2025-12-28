import { useGetTenantByFactory } from '@/app/(features)/-hooks/use-tenacy-asm'
import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import { Button, Icon } from '@/components/ui'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetDefectiveGoodsInventoryQuery } from '../../-hooks/use-defective-goods-asm'

const DownloadExcelButton: React.FC = () => {
	const { user } = useAuth()
	const { data: tenant } = useGetTenantByFactory()
	const { t } = useTranslation()
	const { data } = useGetDefectiveGoodsInventoryQuery()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const factory = t(factories[user?.company_code], { ns: 'ns_common', defaultValue: user?.company_code }) as string

		try {
			const blob = await DefectiveGoodsService.downloadDefectiveGoodsInventoryReport(tenant?.id)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_defective_goods_inventory_report', {
					factory,
					defaultValue: `Defective goods inventory  ~ ${factory}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	return (
		<Button disabled={!Array.isArray(data) || data.length === 0} onClick={handleDownloadExcel}>
			<Icon name='Download' /> {t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
