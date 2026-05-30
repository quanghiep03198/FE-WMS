import { CommonActions } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const CreateTruckloadDialogButton: React.FC = () => {
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	return (
		<Button
			className='size-9 @5xl:w-auto'
			onClick={() => event$.emit({ action: CommonActions.CREATE, payload: null })}>
			<Icon name='CircleFadingPlus' />
			<span className='hidden @5xl:inline-block'>{t('ns_common:actions.add')}</span>
		</Button>
	)
}

export default CreateTruckloadDialogButton
