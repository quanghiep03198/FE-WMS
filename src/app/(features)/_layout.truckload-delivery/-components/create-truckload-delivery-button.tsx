import { CommonActions } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const CreateTruckloadDialogButton: React.FC = () => {
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	return (
		<Button
			size={isMobile ? 'icon' : 'default'}
			variant={isMobile ? 'outline' : 'secondary'}
			onClick={() => event$.emit({ action: CommonActions.CREATE, payload: null })}>
			<Icon name='CircleFadingPlus' /> {!isMobile && t('ns_common:actions.add')}
		</Button>
	)
}

export default CreateTruckloadDialogButton
