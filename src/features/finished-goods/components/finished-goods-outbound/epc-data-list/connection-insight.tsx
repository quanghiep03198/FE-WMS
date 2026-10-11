import { StatusIndicator } from '@components/customs/status-indicator'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../contexts/finished-goods-outbound/page-context'

const ConnectionInsight: React.FC = () => {
	const { t } = useTranslation()
	const { scanningState } = usePageContext('scanningState')

	return (
		<StatusIndicator
			className='flex-col justify-center gap-y-0.5 px-3 @sm/toolbar:h-10 @xl/toolbar:flex-row'
			label={scanningState === 'success' ? t('ns_common:status.running') : t('ns_common:status.idle')}
			labelClassName='@sm/toolbar:block hidden text-muted-foreground! @xl/toolbar:text-sm text-xs'
			size='md'
			state={scanningState === 'success' ? 'active' : scanningState === 'error' ? 'down' : 'fixing'}
		/>
	)
}

export default ConnectionInsight
