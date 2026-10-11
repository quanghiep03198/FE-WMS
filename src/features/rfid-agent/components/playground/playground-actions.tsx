import { CommonActions } from '@common/constants/enums'
import { Div } from '@components/customs/div'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../defective-goods/contexts/page-context'
import { PublishedTopics, useReaderPlaygroundStore } from '../../contexts/rfid-reader-playground-context'

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
				disabled={!connectionStatus.isMQTTConnectionReady}
				size='sm'
				variant={connectionStatus.isReaderConnectionReady ? 'destructive' : 'default'}
				onClick={async () => {
					publishMessage(PublishedTopics.REQUEST_SIGNAL, {
						action: connectionStatus.isReaderConnectionReady ? 'disconnect' : 'connect'
					})
				}}>
				<Icon
					className='hidden @sm/playground-actions:block'
					name={connectionStatus.isReaderConnectionReady ? 'Unplug' : 'PlugZap'}
				/>
				{connectionStatus.isReaderConnectionReady
					? t('ns_common:actions.disconnect')
					: t('ns_common:actions.connect')}
			</Button>
			<Button
				disabled={!connectionStatus.isReaderConnectionReady || !connectionStatus.isMQTTConnectionReady}
				size='sm'
				variant='secondary'
				onClick={async () => {
					publishMessage(PublishedTopics.REQUEST_SIGNAL, {
						action: connectionStatus.isReaderPlaying ? 'stop' : 'start'
					})
				}}>
				<Icon
					className='hidden @sm/playground-actions:block'
					name={connectionStatus.isReaderPlaying ? 'Pause' : 'Play'}
				/>
				{connectionStatus.isReaderPlaying ? t('ns_common:actions.stop') : t('ns_common:actions.start')}
			</Button>
			<Button
				size='sm'
				variant='outline'
				onClick={async () => {
					resetScannedEpcs()
					publishMessage(PublishedTopics.REQUEST_DATA, {
						action: 'reset'
					})
					event$.emit({ action: CommonActions.IMPORT, payload: [] })
				}}>
				<Icon className='hidden @sm/playground-actions:block' name='RefreshCcw' /> {t('ns_common:actions.reset')}
			</Button>
		</Div>
	)
}
