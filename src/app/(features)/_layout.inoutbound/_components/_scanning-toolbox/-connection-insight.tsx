import { cn } from '@/common/utils/cn'
import { Json } from '@/common/utils/json'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener, usePrevious, useResetState } from 'ahooks'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import tw from 'tailwind-styled-components'
import { INCOMING_DATA_CHANGE } from '../../_constants/event.const'
import { usePageContext } from '../../_contexts/-page-context'

const NetworkInsight: React.FC = () => {
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<StatusItem>
			<Typography variant='small'>Internet access</Typography>
			<StatusItemDetail>
				{isNetworkAvailable ? (
					<Icon name='Wifi' size={18} className='stroke-success' />
				) : (
					<Icon name='WifiOff' size={18} className='stroke-muted-foreground' />
				)}
				{isNetworkAvailable ? 'Connected' : 'Disconnected'}
			</StatusItemDetail>
		</StatusItem>
	)
}

const JobStatus: React.FC = () => {
	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))

	return (
		<StatusItem>
			<Typography variant='small'>Job status</Typography>
			<StatusItemDetail>
				<Icon
					name='Dot'
					className={cn(
						'scale-50 rounded-full ring-8',
						scanningStatus === 'connected'
							? 'bg-success fill-success stroke-success ring-success/40'
							: 'bg-warning fill-warning stroke-warning ring-warning/40'
					)}
				/>
				{scanningStatus === 'connected' ? 'Running' : 'Idle'}
			</StatusItemDetail>
		</StatusItem>
	)
}

const TransferDataCalculator: React.FC = () => {
	const [transferredDataSize, setTransferredDataSize] = useState('')

	useEventListener(INCOMING_DATA_CHANGE, (e: CustomEvent<number>) => {
		console.log(e.detail)
		setTransferredDataSize((prev) => prev + e.detail)
	})

	console.log(Json.getContentSize(transferredDataSize))

	return (
		<StatusItem>
			<Typography variant='small'>Transferred data</Typography>
			<StatusItemDetail>
				<Icon name='FileJson2' size={18} />
				{Json.getContentSize(transferredDataSize)} MB
			</StatusItemDetail>
		</StatusItem>
	)
}

const LatencyInsight: React.FC = () => {
	const { pollingDuration } = usePageContext((state) => pick(state, 'pollingDuration'))
	const [currentTime, setCurrentTime] = useState<number>(performance.now())
	const previousTime = usePrevious(currentTime)
	const [latency, setLatency, reset] = useResetState(0)

	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))

	useEventListener(INCOMING_DATA_CHANGE, () => setCurrentTime(performance.now()))

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') reset()
		if (scanningStatus === 'connected') {
			const latency = currentTime - previousTime - pollingDuration
			console.log(currentTime - previousTime)
			setLatency(latency > 0 ? +latency.toFixed(2) : 0)
		}
	}, [scanningStatus, currentTime, scanningStatus, pollingDuration])

	return (
		<StatusItem>
			<Typography variant='small'>Latency</Typography>
			<StatusItemDetail>
				<Icon name='Gauge' size={18} />
				<Typography variant='small' className={cn(latency / 1000 >= 1 && 'text-warning')}>
					{latency / 1000 >= 1 ? `${latency / 1000} s` : `${latency} ms`}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

const ConnectionInsight: React.FC = () => {
	return (
		<Div className='space-y-4'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				Network status
			</Typography>
			<Div className='flex-1 space-y-4'>
				<NetworkInsight />
				<LatencyInsight />
				<JobStatus />
				<TransferDataCalculator />
			</Div>
		</Div>
	)
}

const StatusItem = tw.div`grid grid-cols-3 gap-x-6 group-has-[#toggle-pin-toolbar[data-state=on]]:grid-cols-2`
const StatusItemDetail = tw.div`inline-grid grid-cols-[24px_auto] items-center gap-x-2 group-has-[#toggle-pin-toolbar[data-state=off]]:col-span-2 text-sm`

export default ConnectionInsight
