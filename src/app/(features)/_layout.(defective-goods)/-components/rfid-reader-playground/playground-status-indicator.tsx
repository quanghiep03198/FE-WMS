import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const PlaygroundStatusIndicator: React.FC = () => {
	const { connectionStatus } = useReaderPlaygroundStore('connectionStatus')
	const { t } = useTranslation()

	return (
		<StatusIndicator
			state={
				Object.values(connectionStatus).every((value) => value)
					? 'active'
					: connectionStatus.isMQTTConnectionReady
						? 'fixing'
						: 'down'
			}
			label={t('ns_inoutbound:counter_box.label')}
			className='ml-2'
			labelClassName='text-base after:content-[":"] ml-1 inline-flex items-center gap-x-1 font-medium'
		/>
	)
}

export default PlaygroundStatusIndicator
