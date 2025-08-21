import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useDownloadReport } from '../-hooks/use-download-report'

const DownloadAssemblyProductivityButton: React.FC = () => {
	const { t } = useTranslation()
	const handleDownloadReport = useDownloadReport()

	return (
		<Button onClick={() => handleDownloadReport('shaping-department-productivity')}>
			<Icon name='FileChartLine' />
			{t('ns_erp:fields.shaping_dept_productivity')}
		</Button>
	)
}

export default DownloadAssemblyProductivityButton
