import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, Icon } from '@/components/ui'
import { TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const factory = t(factories[user.company_code], { ns: 'ns_common', defaultValue: user.company_code }) as string

		try {
			const blob = await TruckloadDeliveryService.downloadExcel()
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_truckload_delivery_report', {
					factory,
					defaultValue: `Truckload Delivery Report  ~ ${factory}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	return (
		<Button variant='outline' size={isMobile ? 'icon' : 'default'} onClick={handleDownloadExcel}>
			<Icon name='Download' /> {!isMobile && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
