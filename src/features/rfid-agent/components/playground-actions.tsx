import { Button, Div, Icon } from '@/components/ui'
import { CommonActions } from '@common/constants/enums'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../defective-goods/contexts/page-context'
import { PublishedTopics, useReaderPlaygroundStore } from '../contexts/rfid-reader-playground.context'

export const PlaygroundActions: React.FC = () => {
	const { event$ } = usePageContext()
	const { connectionStatus, resetScannedEpcs, publishMessage } = useReaderPlaygroundStore(
		'connectionStatus',
		'setConnectionStatus',
		'resetScannedEpcs',
		'publishMessage'
	)
	const { t } = useTranslation()

	return (
		<Div className='@container/playground-actions grid grid-cols-3 items-center gap-x-2 p-2'>
			<Button
				size='sm'
				disabled={!connectionStatus.isMQTTConnectionReady}
				variant={connectionStatus.isReaderConnectionReady ? 'destructive' : 'default'}
				onClick={async () => {
					publishMessage(PublishedTopics.REQUEST_SIGNAL, {
						action: connectionStatus.isReaderConnectionReady ? 'disconnect' : 'connect'
					})
				}}>
				<Icon
					name={connectionStatus.isReaderConnectionReady ? 'Unplug' : 'PlugZap'}
					className='hidden @sm/playground-actions:block'
				/>
				{connectionStatus.isReaderConnectionReady
					? t('ns_common:actions.disconnect')
					: t('ns_common:actions.connect')}
			</Button>
			<Button
				size='sm'
				variant='secondary'
				disabled={!connectionStatus.isReaderConnectionReady || !connectionStatus.isMQTTConnectionReady}
				onClick={async () => {
					publishMessage(PublishedTopics.REQUEST_SIGNAL, {
						action: connectionStatus.isReaderPlaying ? 'stop' : 'start'
					})
				}}>
				<Icon
					name={connectionStatus.isReaderPlaying ? 'Pause' : 'Play'}
					className='hidden @sm/playground-actions:block'
				/>
				{connectionStatus.isReaderPlaying ? t('ns_common:actions.stop') : t('ns_common:actions.start')}
			</Button>
			<Button
				variant='outline'
				size='sm'
				onClick={async () => {
					resetScannedEpcs()
					publishMessage(PublishedTopics.REQUEST_DATA, {
						action: 'reset'
					})
					event$.emit({ action: CommonActions.IMPORT, payload: [] })
				}}>
				<Icon name='RefreshCcw' className='hidden @sm/playground-actions:block' /> {t('ns_common:actions.reset')}
			</Button>
		</Div>
	)
}
