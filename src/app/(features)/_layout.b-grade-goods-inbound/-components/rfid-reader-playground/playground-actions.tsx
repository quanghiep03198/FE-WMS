import { Button, Div, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

export const RFIDReaderPlaygroundActions: React.FC = () => {
	const { connectionStatus, resetScannedEpcs, publishMessage } = useReaderPlaygroundStore(
		'connectionStatus',
		'setConnectionStatus',
		'resetScannedEpcs',
		'publishMessage'
	)
	const { t } = useTranslation()

	return (
		<Div className='grid h-[var(--playground-actions-height)] grid-cols-3 items-center gap-x-2 p-2'>
			<Button
				size='sm'
				disabled={!connectionStatus.isMQTTConnectionReady}
				variant={connectionStatus.isReaderConnectionReady ? 'destructive' : 'default'}
				onClick={async () => {
					publishMessage('request/signal', {
						act: connectionStatus.isReaderConnectionReady ? 'disconnect' : 'connect'
					})
				}}>
				<Icon name={connectionStatus.isReaderConnectionReady ? 'Unplug' : 'PlugZap'} />
				{connectionStatus.isReaderConnectionReady
					? t('ns_common:actions.disconnect')
					: t('ns_common:actions.connect')}
			</Button>
			<Button
				size='sm'
				variant='secondary'
				disabled={!connectionStatus.isReaderConnectionReady}
				onClick={async () => {
					publishMessage('request/signal', {
						act: connectionStatus.isReaderPlaying ? 'stop' : 'start'
					})
				}}>
				<Icon name={connectionStatus.isReaderPlaying ? 'Pause' : 'Play'} />
				{connectionStatus.isReaderPlaying ? 'Stop reading' : 'Start reading'}
			</Button>
			<Button
				variant='outline'
				size='sm'
				onClick={async () => {
					resetScannedEpcs()
					publishMessage('request/data', {
						act: 'reset'
					})
				}}>
				<Icon name='RotateCw' /> {t('ns_common:actions.reset')}
			</Button>
		</Div>
	)
}
