import { CommonActions } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const CreateTruckloadDialogButton: React.FC = () => {
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	return (
		<Button onClick={() => event$.emit({ action: CommonActions.CREATE, defaultValues: null })}>
			<Icon name='CircleFadingPlus' /> {t('ns_common:actions.add')}
		</Button>
	)
}

export default CreateTruckloadDialogButton
