import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Button variant='secondary'>
			<Icon name='Download' /> {t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
