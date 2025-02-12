import { cn } from '@/common/utils/cn'
import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { useEventListener } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
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

const ConnectionInsight: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div as='section' className='flex flex-shrink flex-col gap-y-3 @5xl:flex-grow'>
			<Typography variant='h6' className='inline-flex items-center gap-x-2 text-lg sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.network_status')}
			</Typography>
			<Div className='flex-1 basis-full space-y-2 rounded-lg border p-4'>
				<NetworkInsight />
				<JobStatus />
			</Div>
		</Div>
	)
}

const StatusItem = tw.div`grid grid-cols-[9rem_auto] gap-x-20 sm:gap-x-6 xl:gap-x-4`
const StatusItemDetail = tw.div`inline-grid grid-cols-[24px_auto] items-center gap-x-2 text-sm`

export default ConnectionInsight
