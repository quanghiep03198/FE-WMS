import { cn } from '@/common/utils/cn'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener, usePrevious, useResetState } from 'ahooks'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { INCOMING_DATA_CHANGE } from '../../_constants/rfid.const'
import { usePageContext } from '../../_contexts/-page-context'

const NetworkInsight: React.FC = () => {
	const { t } = useTranslation()
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:rfid_toolbox.internet_access')}
			</Typography>
			<StatusItemDetail>
				{isNetworkAvailable ? (
					<Icon name='Wifi' size={18} className='stroke-success' />
				) : (
					<Icon name='WifiOff' size={18} className='stroke-muted-foreground' />
				)}
				{isNetworkAvailable ? t('ns_common:status.connected') : t('ns_common:status.disconnected')}
			</StatusItemDetail>
		</StatusItem>
	)
}

const JobStatus: React.FC = () => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:rfid_toolbox.cron_job')}
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
				{scanningStatus === 'connected' ? t('ns_common:status.running') : t('ns_common:status.idle')}
			</StatusItemDetail>
		</StatusItem>
	)
}

const LatencyInsight: React.FC = () => {
	const { t } = useTranslation()
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
			setLatency(latency > 0 ? +latency.toFixed(2) : 0)
		}
	}, [scanningStatus, currentTime, scanningStatus, pollingDuration])

	return (
		<StatusItem>
			<Typography variant='small' className='font-medium'>
				{t('ns_inoutbound:rfid_toolbox.latency')}
			</Typography>
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
	const { t } = useTranslation()

	return (
		<Div className='space-y-4'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				{t('ns_inoutbound:rfid_toolbox.network_status')}
			</Typography>
			<Div className='flex-1 space-y-2'>
				<NetworkInsight />
				<LatencyInsight />
				<JobStatus />
			</Div>
		</Div>
	)
}

const StatusItem = tw.div`grid grid-cols-2 gap-x-20 sm:gap-x-6 xl:gap-x-4`
const StatusItemDetail = tw.div`inline-grid grid-cols-[24px_auto] items-center gap-x-2 text-sm`

export default ConnectionInsight
//  chủn xiang níu chu/yíang? - ngu như con lợn

/**
 * nỉ
 */
