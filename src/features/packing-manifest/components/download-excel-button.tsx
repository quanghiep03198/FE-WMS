import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { useExportPackingManifest } from '@features/packing-manifest/hooks/use-export-packing-manifest'
import type { ManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { useTranslation } from 'react-i18next'

const DownloadExcelButton: React.FC<{ filters: ManifestFilters }> = ({ filters }) => {
	const { t } = useTranslation()
	const { isRunning, start } = useExportPackingManifest(filters)

	return (
		<Button disabled={isRunning} onClick={() => void start()}>
			<Icon className={isRunning ? 'animate-spin' : undefined} name={isRunning ? 'LoaderCircle' : 'Download'} />{' '}
			{t('ns_common:actions.download_excel')}
		</Button>
	)
}

export default DownloadExcelButton
