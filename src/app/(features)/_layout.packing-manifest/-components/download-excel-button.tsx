import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import { Button, Icon } from '@/components/ui'
import { PackingService } from '@/services/packing.service'
import { format } from 'date-fns'
import saveAs from 'file-saver'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useAuth()

	const handleDownloadExcel = async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await PackingService.downloadPackingManifest()
			saveAs(
				blob,
				t('ns_packing:titles.file_packing_manifest', {
					factory: t(factories[user?.current_factory_code], { ns: 'ns_common' }),
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
