import { FactoryAgencyCode } from '@common/constants/enums'
import env from '@common/utils/env'
import { Button, Icon } from '@components/ui'
import { InventoryService } from '@features/inventory/services/inventory.service'
import useMediaQuery from '@hooks/use-media-query'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DownloadExcelButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
	const { t } = useTranslation()
	const isSmallScreen = useMediaQuery('(max-width:800px)')

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await InventoryService.downloadProductionInventoryReport()
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_production_inventory_summary', {
					factory: FactoryAgencyCode[env<FactoryCode>('VITE_APP_TENANT')],
					defaultValue: null
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch (e) {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<Button {...props} size={isSmallScreen ? 'icon' : props.size} onClick={() => handleDownloadExcel()}>
			<Icon name='Download' size={20} />
			{!isSmallScreen && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
