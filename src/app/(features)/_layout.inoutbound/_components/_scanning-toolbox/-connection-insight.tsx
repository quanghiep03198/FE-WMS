import { cn } from '@/common/utils/cn'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener, useResetState } from 'ahooks'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../_contexts/-page-context'

const NetworkInsight: React.FC = () => {
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener('RETRIEVE_NETWORK_CONNECTION', (e: CustomEvent<boolean>) => {
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
	const [transferredDataSize, setTransferredDataSize] = useState(0)

	useEventListener('RETRIEVE_TRANSFERRED_DATA', (e: CustomEvent<number>) => {
		setTransferredDataSize(e.detail)
	})

	return (
		<StatusItem>
			<Typography variant='small'>Transferred data</Typography>
			<StatusItemDetail>
				<Icon name='FileJson2' size={18} />
				{transferredDataSize} MB transferred
			</StatusItemDetail>
		</StatusItem>
	)
}

const LatencyInsight: React.FC = () => {
	const [latency, setLatency, reset] = useResetState(0)
	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))

	useEventListener('RETRIEVE_LATENCY', (e: CustomEvent<number>) => {
		if (scanningStatus === 'connected') setLatency(e.detail < 0 ? 0 : +e.detail.toFixed(2))
	})

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') reset()
	}, [scanningStatus])

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
