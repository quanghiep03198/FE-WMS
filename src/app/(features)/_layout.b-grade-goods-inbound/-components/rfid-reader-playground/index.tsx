import { CommonActions } from '@/common/constants/enums'
import { Div } from '@/components/ui'
import { memo } from 'react'
import { usePageContext } from '../../-contexts/page-context'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import { RFIDReaderPlaygroundActions } from './playground-actions'
import { PlaygroundEmptyDataState } from './playground-empty-data-state'
import { PlaygroundEpcList } from './playground-epc-list'
import PlaygroundHeader from './playground-header'
import UnavailableConnection from './unavailable-connection'

export type RFIDActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset'

Set.prototype.at = function (index: number) {
	return Array.from(this).at(index)
}

const RFIDReaderPlayground: React.FC = () => {
	const { connectionStatus, scannedEpcs, resetScannedEpcs } = useReaderPlaygroundStore(
		'scannedEpcs',
		'resetScannedEpcs',
		'connectionStatus',
		'setScannedEpcs',
		'setConnectionStatus',
		'publishMessage'
	)

	const { event$ } = usePageContext()

	event$.useSubscription((e: { action: CommonActions; payload: [] }) => {
		if (e.action === CommonActions.SAVE) resetScannedEpcs()
	})

	return (
		<Div
			className='flex h-full flex-col divide-y'
			style={
				{
					'--playground-header-height': '52px',
					'--playground-actions-height': '52px'
				} as React.CSSProperties
			}>
			<PlaygroundHeader />

			{!connectionStatus.isMQTTConnectionReady ? (
				<UnavailableConnection />
			) : scannedEpcs.length > 0 ? (
				<PlaygroundEpcList />
			) : (
				<PlaygroundEmptyDataState />
			)}
			<RFIDReaderPlaygroundActions />
		</Div>
	)
}

export default memo(RFIDReaderPlayground)
