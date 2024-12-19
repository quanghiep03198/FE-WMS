import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { cn } from '@/common/utils/cn'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { Separator } from '@radix-ui/react-context-menu'
import { useEventListener, useLocalStorageState, usePrevious, useResetState } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import { usePageContext } from '../../_contexts/-page-context'
import { DEFAULT_FP_RFID_SETTINGS, RFIDSettings } from '../../index.lazy'

const NetworkInsight: React.FC = () => {
	const { t } = useTranslation()
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:scanner_setting.internet_access')}
			</Typography>
			<StatusItemDetail>
				{isNetworkAvailable ? (
					<Icon name='Wifi' size={20} className='stroke-success' />
				) : (
					<Icon name='WifiOff' size={20} className='stroke-muted-foreground' />
				)}
				<Typography variant='small' className='font-medium'>
					{isNetworkAvailable ? t('ns_common:status.connected') : t('ns_common:status.disconnected')}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

const JobStatus: React.FC = () => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:scanner_setting.cron_job')}
			</Typography>
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
				<Typography variant='small' className='font-medium'>
					{scanningStatus === 'connected' ? t('ns_common:status.running') : t('ns_common:status.idle')}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

const LatencyInsight: React.FC = () => {
	const { t } = useTranslation()
	const [settings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})
	const [currentTime, setCurrentTime] = useState<number>(performance.now())
	const previousTime = usePrevious(currentTime)
	const [latency, setLatency, reset] = useResetState(0)

	const { scanningStatus } = usePageContext('scanningStatus')

	useEventListener(INCOMING_DATA_CHANGE, () => setCurrentTime(performance.now()))

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_FP_RFID_SETTINGS.pollingDuration

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') reset()
		if (scanningStatus === 'connected') {
			const latency = currentTime - previousTime - pollingDuration
			setLatency(latency > 0 ? parseFloat(latency.toFixed(2)) : 0)
		}
	}, [scanningStatus, currentTime, scanningStatus, settings?.pollingDuration])

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:scanner_setting.latency')}
			</Typography>
			<StatusItemDetail>
				<Icon name='Gauge' size={20} />
				<Typography variant='small' className={cn('font-medium', latency / 1000 >= 1 && 'text-warning')}>
					{latency / 1000 >= 1 ? `${latency / 1000} s` : `${latency} ms`}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

const ConnectionInsight: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div as='section' className='flex-1 space-y-3'>
			<Typography variant='h6' className='inline-flex items-center gap-x-2 text-lg sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.network_status')}
			</Typography>
			<Separator />
			<Div className='flex-1 space-y-2 rounded-lg border p-4'>
				<NetworkInsight />
				<LatencyInsight />
				<JobStatus />
			</Div>
		</Div>
	)
}

const StatusItem = tw.div`grid grid-cols-[1fr_1.5fr] gap-x-20 sm:gap-x-6 xl:gap-x-4`
const StatusItemDetail = tw.div`inline-grid grid-cols-[24px_auto] items-center gap-x-2 text-sm`

export default ConnectionInsight
