import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import { useDeepCompareEffect, useInterval } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { PublishedTopics, useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const MAX_RETRY = 3

const PlaygroundStatusIndicator: React.FC = () => {
	const { connectionStatus, pingCount, setPingCount, setScannedEpcs, setConnectionStatus, publishMessage } =
		useReaderPlaygroundStore(
			'connectionStatus',
			'pingCount',
			'setPingCount',
			'setScannedEpcs',
			'setConnectionStatus',
			'publishMessage'
		)
	const { t } = useTranslation()

	const stopPingInterval = useInterval(
		() => {
			publishMessage(PublishedTopics.REQUEST_SIGNAL, { action: 'ping' })
			setPingCount(pingCount + 1)
			// pingCountRef.current++
		},
		1000,
		{ immediate: pingCount > 0 }
	)

	useDeepCompareEffect(() => {
		console.log('pingCountRef', pingCount)
		if (pingCount > MAX_RETRY) {
			stopPingInterval()
			setScannedEpcs([])
			setConnectionStatus({
				isMQTTConnectionReady: false,
				isReaderConnectionReady: false,
				isReaderPlaying: false
			})
		}
	}, [pingCount])

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
