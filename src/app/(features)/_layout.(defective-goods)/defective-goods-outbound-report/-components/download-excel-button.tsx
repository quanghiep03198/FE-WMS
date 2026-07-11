import { Button, Icon } from '@/components/ui'
import useMediaQuery from '@/hooks/use-media-query'
import { useTranslation } from 'react-i18next'
import { useDownloadReport } from '../-hooks/use-download-report'

const DownloadExcelButton: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const handleDownloadReport = useDownloadReport()

	return (
		<Button
			variant={isLargeScreen ? 'default' : 'outline'}
			size={isLargeScreen ? 'default' : 'icon'}
			onClick={() => handleDownloadReport()}>
			<Icon name='Download' />
			{isLargeScreen && t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
