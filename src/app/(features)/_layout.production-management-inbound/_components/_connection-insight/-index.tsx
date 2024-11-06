import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { RFIDSettings } from '@/app/(features)/_layout.finished-production-inoutbound/_constants/rfid.const'
import { cn } from '@/common/utils/cn'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener, useLocalStorageState, usePrevious, useResetState } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'
type Props = {}

export const NetworkInsight: React.FC = () => {
	const { t } = useTranslation()
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<Typography variant='small' className='inline-flex items-center justify-center gap-x-2'>
			{isNetworkAvailable ? (
				<Icon name='Wifi' size={18} className='stroke-success' />
			) : (
				<Icon name='WifiOff' size={18} className='stroke-muted-foreground' />
			)}
			{isNetworkAvailable ? t('ns_common:status.connected') : t('ns_common:status.disconnected')}
		</Typography>
	)
}

export const JobStatus: React.FC = () => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')

	return (
		<Typography variant='small' className='inline-flex items-center justify-center gap-x-2'>
			<Icon
				name='Dot'
				className={cn(
					'scale-50 rounded-full ring-8',
					scanningStatus === 'connected'
						? 'bg-success fill-success stroke-success ring-success/40'
						: 'bg-warning fill-warning stroke-warning ring-warning/40'
				)}
			/>
			{scanningStatus === 'connected' ? t('ns_common:status.running') : t('ns_common:status.idle')}
		</Typography>
	)
}

export const LatencyInsight: React.FC = () => {
	const { t } = useTranslation()
	const [pollingDuration] = useLocalStorageState<number>(RFIDSettings.SSE_POLLING_DURATION, {
		listenStorageChange: true
	})
	const [currentTime, setCurrentTime] = useState<number>(performance.now())
	const previousTime = usePrevious(currentTime)
	const [latency, setLatency, reset] = useResetState(0)

	const { scanningStatus } = usePageContext('scanningStatus')

	useEventListener(INCOMING_DATA_CHANGE, () => setCurrentTime(performance.now()))

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') reset()
		if (scanningStatus === 'connected') {
			const latency = currentTime - previousTime - 500
			setLatency(latency > 0 ? +latency.toFixed(2) : 0)
		}
	}, [scanningStatus, currentTime, scanningStatus, pollingDuration])

	return (
		<Typography variant='small' className='inline-flex items-center justify-center gap-x-2'>
			<Icon name='Gauge' size={18} />
			<Typography variant='small' className={cn(latency / 1000 >= 1 && 'text-warning')}>
				{latency / 1000 >= 1 ? `${latency / 1000} s` : `${latency} ms`}
			</Typography>
		</Typography>
	)
}

export const ConnectionInsight: React.FC = () => {
	return (
		<Div className='grid h-full min-h-10 grid-cols-3 items-center rounded-md border bg-accent/25 *:w-full'>
			<NetworkInsight />
			<JobStatus />
			<LatencyInsight />
		</Div>
	)
}
