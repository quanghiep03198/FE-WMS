import { Button, Icon } from '@/components/ui'
import { CommonActions } from '@common/constants/enums'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const CreateTruckloadDialogButton: React.FC = () => {
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	return (
		<Button
			className='size-9 p-0 @2xl:w-auto @2xl:px-4 @2xl:py-2'
			onClick={() => event$.emit({ action: CommonActions.CREATE, payload: null })}>
			<Icon name='CircleFadingPlus' />
			<span className='hidden @2xl:inline-block'>{t('ns_common:actions.add')}</span>
		</Button>
	)
}

export default CreateTruckloadDialogButton
