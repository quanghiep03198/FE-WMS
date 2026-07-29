import { Button, Div, Icon } from '@components/ui'
import UploadDataFileDialog from '@features/finished-goods/components/upload-data-dialog'
import { useTranslation } from 'react-i18next'

const ActionsToolbar: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex items-center justify-end gap-x-2'>
			<UploadDataFileDialog station='WH103' maxFiles={200} />
			<Button variant='secondary' onClick={() => window.dispatchEvent(new CustomEvent('refetch-outbound-sse'))}>
				<Icon name='RefreshCcw' />
				{t('ns_common:actions.reload')}
			</Button>
		</Div>
	)
}

export default ActionsToolbar
