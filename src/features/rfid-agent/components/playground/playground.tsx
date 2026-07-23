import { cn } from '@common/utils/cn'
import { Div } from '@components/ui'
import { useUnmount } from 'ahooks'
import { memo } from 'react'
import { PublishedTopics, useReaderPlaygroundStore } from '../../contexts/rfid-reader-playground-context'
import { PlaygroundActions } from './playground-actions'
import { PlaygroundEmptyDataState } from './playground-empty-data-state'
import { PlaygroundEpcList } from './playground-epc-list'
import PlaygroundHeader from './playground-header'
import UnavailableConnection from './unavailable-connection'

export type RFIDActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset'

Set.prototype.at = function (index: number) {
	return Array.from(this).at(index)
}

const RFIDReaderPlayground: React.FC<React.ComponentProps<'div'> & { resetOnUnmount?: boolean }> = ({
	className,
	style,
	resetOnUnmount = true
}) => {
	const { connectionStatus, scannedEpcs, publishMessage } = useReaderPlaygroundStore(
		'scannedEpcs',
		'connectionStatus',
		'publishMessage'
	)

	useUnmount(() => {
		if (resetOnUnmount) publishMessage(PublishedTopics.REQUEST_DATA, { action: 'reset' })
	})

	return (
		<Div
			className={cn(
				'@container/playground grid h-full w-full grid-rows-[var(--playground-header-height)_auto_var(--playground-actions-height)] divide-y',
				className
			)}
			style={
				{
					'--playground-header-height': '52px',
					'--playground-actions-height': '52px',
					...style
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
