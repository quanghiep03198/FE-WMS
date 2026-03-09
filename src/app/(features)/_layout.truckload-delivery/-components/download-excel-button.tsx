import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, Icon } from '@/components/ui'
import { TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageQueryParams } from '../-hooks/use-page-query-params'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const isMobile = useMediaQuery('(max-width: 919px)')
	const { searchParams } = usePageQueryParams()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const factory = t(factories[user?.current_factory_code], {
			ns: 'ns_common',
			defaultValue: user?.current_factory_code
		}) as string

		try {
			const blob = await TruckloadDeliveryService.downloadExcel(searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_truckload_delivery_report', {
					factory,
					defaultValue: null
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	return (
		<Button
			variant={isMobile ? 'outline' : 'default'}
			size={isMobile ? 'icon' : 'default'}
			onClick={handleDownloadExcel}>
			<Icon name='Download' /> {!isMobile && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
