import { TRANSLATED_FACTORY } from '@common/constants/constants'
import env from '@common/utils/env'
import { Button, Icon } from '@components/ui'
import { PackingService } from '@features/packing-manifest/services/packing.service'
import { format } from 'date-fns'
import saveAs from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		const factory = env<FactoryCode>('VITE_APP_TENANT')

		try {
			const blob = await PackingService.downloadPackingManifest()
			saveAs(
				blob,
				t('ns_packing:titles.file_packing_manifest', {
					factory: t(TRANSLATED_FACTORY[factory], {
						ns: 'ns_common',
						defaultValue: factory
					}),
					defaultValue: `Packing manifest ~ ${format(new Date(), 'yyyy-MM-dd')}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}

	return (
		<Button onClick={handleDownloadExcel}>
			<Icon name='Download' /> {t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
