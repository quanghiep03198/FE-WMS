import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
import { memo } from 'react'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import { PlaygroundActions } from './playground-actions'
import { PlaygroundEmptyDataState } from './playground-empty-data-state'
import { PlaygroundEpcList } from './playground-epc-list'
import PlaygroundHeader from './playground-header'
import UnavailableConnection from './unavailable-connection'

export type RFIDActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset'

Set.prototype.at = function (index: number) {
	return Array.from(this).at(index)
}

const RFIDReaderPlayground: React.FC<React.ComponentProps<'div'>> = ({ className }) => {
	const { connectionStatus, scannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'connectionStatus')

	return (
		<Div
			className={cn('flex h-full min-w-80 flex-col divide-y', className)}
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
			<PlaygroundActions />
		</Div>
	)
}

export default memo(RFIDReaderPlayground)
