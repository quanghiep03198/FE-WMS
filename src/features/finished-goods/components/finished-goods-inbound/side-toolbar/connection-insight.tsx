import { NETWORK_CONNECTION_CHANGE } from '@/components/shared/network-detector'
import { Div, Icon, Typography } from '@/components/ui'
import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import type { ScanningStatus } from '@/features/finished-goods/types'
import { cn } from '@common/utils/cn'
import { useEventListener } from 'ahooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'

export const NetworkInsight: React.FC<React.ComponentProps<'div'>> = (props) => {
	const { t } = useTranslation()
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	return (
		<StatusItem {...props}>
			<Typography data-slot='label' variant='small' className='font-medium'>
				{t('ns_inoutbound:scanner_setting.server_connection')}
			</Typography>
			<StatusItemDetail data-slot='detail'>
				{isNetworkAvailable ? (
					<Icon name='Server' className='stroke-success' />
				) : (
					<Icon name='ServerCrash' className='stroke-muted-foreground' />
				)}
				<Typography variant='small' className='font-medium'>
					{isNetworkAvailable ? t('ns_common:status.connected') : t('ns_common:status.disconnected')}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

export const JobStatus: React.FC<React.ComponentProps<'div'>> = (props) => {
	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')
	const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true)

	useEventListener(NETWORK_CONNECTION_CHANGE, (e: CustomEvent<boolean>) => {
		setIsNetworkAvailable(e.detail)
	})

	const indicatorState: Record<ScanningStatus | 'error', 'active' | 'idle' | 'down' | 'fixing'> = {
		connected: 'active',
		disconnected: 'idle',
		error: 'down',
		connecting: 'fixing'
	}

	return (
		<StatusItem {...props}>
			<Typography data-slot='label' variant='small' className='font-medium'>
				{t('ns_inoutbound:scanner_setting.cron_job')}
			</Typography>
			<StatusItemDetail data-slot='detail'>
				<StatusIndicator
					state={!isNetworkAvailable ? indicatorState.error : indicatorState[scanningStatus]}
					className='justify-center'
				/>
				<Typography variant='small' className='font-medium'>
					{scanningStatus === 'connected' ? t('ns_common:status.running') : t('ns_common:status.idle')}
				</Typography>
			</StatusItemDetail>
		</StatusItem>
	)
}

export const ConnectionInsight: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div
			data-slot='connection-insight'
			className={cn('grid grid-cols-2 rounded-md border bg-background p-4 shadow-none', className)}
			{...props}>
			<NetworkInsight className='grid-cols-1 *:data-[slot=detail]:gap-x-2 *:data-[slot=label]:hidden' />
			<JobStatus className='grid-cols-1 *:data-[slot=detail]:gap-x-2 *:data-[slot=label]:hidden' />
			{/* <Watchers className='grid-cols-1 *:data-[slot=detail]:gap-x-2 *:data-[slot=label]:hidden' /> */}
		</Div>
	)
}

const StatusItem: React.FC<React.ComponentProps<'div'>> = tw.div`grid grid-cols-[2fr_3fr] gap-x-6`
const StatusItemDetail: React.FC<React.ComponentProps<'div'>> =
	tw.div`inline-grid grid-cols-[18px_auto] items-center gap-x-3 text-sm`
