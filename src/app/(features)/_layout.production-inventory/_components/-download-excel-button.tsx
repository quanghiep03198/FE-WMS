import { FactoryAgencyCode } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import { Button, Icon } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

const DownloadExcelButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const { data: tenant } = useGetTenantByFactory()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await InventoryService.downloadProductionInventoryReport(tenant?.id)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_production_inventory_summary', {
					factory: FactoryAgencyCode[user.company_code],
					defaultValue: null
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch (e) {
			console.log(e.message)
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<Button {...props} onClick={() => handleDownloadExcel()}>
			<Icon name='Download' size={20} role='presentation' />
			{t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
