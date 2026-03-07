import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../-contexts/page-context'

const ConnectionInsight: React.FC = () => {
	const { t } = useTranslation()
	const { scanningState } = usePageContext('scanningState')

	return (
		<StatusIndicator
			size='md'
			state={scanningState === 'success' ? 'active' : scanningState === 'error' ? 'down' : 'fixing'}
			label={scanningState === 'success' ? t('ns_common:status.running') : t('ns_common:status.idle')}
			className='justify-center px-3 @sm/toolbar:h-10'
			labelClassName='font-medium @sm/toolbar:block hidden'
		/>
	)
}

export default ConnectionInsight
