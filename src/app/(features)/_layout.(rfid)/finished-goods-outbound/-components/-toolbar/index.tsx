import UploadDataFileDialog from '@/app/(features)/-components/-shared/upload-dialog'
import { Button, Div, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const ActionsToolbar: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex items-center justify-end gap-x-2'>
			<UploadDataFileDialog station='WH103' maxFiles={200} />
			<Button variant='secondary' onClick={() => window.dispatchEvent(new CustomEvent('refetch-outbound-sse'))}>
				<Icon name='RotateCw' role='presentation' />
				{t('ns_common:actions.reload')}
			</Button>
		</Div>
	)
}

export default ActionsToolbar
