import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { cn } from '@/common/utils/cn'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener, useLocalStorageState, usePrevious, useResetState } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_PM_RFID_SETTINGS, RFIDSettings } from '../..'
import { PM_RFID_SETTINGS_KEY } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'

export const NetworkInsight: React.FC = () => {
	const { t } = useTranslation()
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<Typography variant='small' className='inline-flex items-center gap-x-2'>
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
		<Typography variant='small' className='inline-flex items-center gap-x-2'>
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
	const { scanningStatus } = usePageContext('scanningStatus')
	const [currentTime, setCurrentTime] = useState<number>(performance.now())
	const previousTime = usePrevious(currentTime)
	const [latency, setLatency, reset] = useResetState(0)
	const [settings] = useLocalStorageState<RFIDSettings>(PM_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_PM_RFID_SETTINGS.pollingDuration

	useEventListener(INCOMING_DATA_CHANGE, () => setCurrentTime(performance.now()))

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') reset()
		if (scanningStatus === 'connected') {
			const latency = currentTime - previousTime - 500
			setLatency(latency > 0 ? +latency.toFixed(2) : 0)
		}
	}, [scanningStatus, currentTime, scanningStatus, pollingDuration])

	return (
		<Typography variant='small' className='inline-flex items-center gap-x-2'>
			<Icon name='Gauge' size={18} />
			<Typography variant='small' className={cn(latency / 1000 >= 1 && 'text-warning')}>
				{latency / 1000 >= 1 ? `${latency / 1000} s` : `${latency} ms`}
			</Typography>
		</Typography>
	)
}

export const DataListFooter: React.FC = () => {
	return (
		<Div className='flex items-center justify-around gap-x-6'>
			<NetworkInsight />
			<LatencyInsight />
			<JobStatus />
		</Div>
	)
}
