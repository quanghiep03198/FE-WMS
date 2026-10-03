import { StatusIndicator } from '@components/ui/@custom/status-indicator'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../contexts/rfid-reader-playground-context'

const PlaygroundStatusIndicator: React.FC = () => {
	const { connectionStatus } = useReaderPlaygroundStore('connectionStatus')
	const { t } = useTranslation()

	return (
		<StatusIndicator
			className='ml-2'
			label={t('ns_inoutbound:counter_box.label')}
			labelClassName='text-base after:content-[":"] ml-1 inline-flex items-center gap-x-1 font-medium'
			state={
				Object.values(connectionStatus).every((value) => value)
					? 'active'
					: connectionStatus.isMQTTConnectionReady
						? 'fixing'
						: 'down'
			}
		/>
	)
}

export default PlaygroundStatusIndicator
