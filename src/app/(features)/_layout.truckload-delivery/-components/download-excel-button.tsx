import { Button, Icon } from '@/components/ui'
import { TruckloadDeliveryService } from '@/services/truckload-delivery.service'
import { TRANSLATED_FACTORY } from '@common/constants/constants'
import useAuth from '@hooks/use-auth'
import { saveAs } from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageQueryParams } from '../-hooks/use-page-query-params'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const { searchParams } = usePageQueryParams()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const factory = t(TRANSLATED_FACTORY[user?.current_factory_code], {
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
		<Button variant='outline' onClick={handleDownloadExcel}>
			<Icon name='Download' /> {t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
