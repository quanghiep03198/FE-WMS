import { useBrowserTabStatus } from '@/common/hooks/use-browser-tab-status'
import { Button, ButtonProps, Div, Icon, Typography } from '@/components/ui'
import { useQueryClient } from '@tanstack/react-query'
import { usePrevious } from 'ahooks'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../-contexts/page-context'
import { FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG } from '../../-hooks'

interface TScanningButtonProps extends Pick<ButtonProps, 'children' | 'variant'> {
	icon: React.ComponentProps<typeof Icon>['name']
}

const INACTIVE_TIME = 1000 * 60 * 15 // 15 minutes

const ScannerActions: React.FC = () => {
	const { t, i18n } = useTranslation()
	const queryClient = useQueryClient()
	const {
		scanningStatus,
		setScanningStatus,
		reset: resetScanningAction,
		handleToggleScanning
	} = usePageContext('scanningStatus', 'setScanningStatus', 'handleToggleScanning', 'reset')
	const previousStatus = usePrevious(scanningStatus)

	const scanningButtonProps = useMemo<TScanningButtonProps>(() => {
		if (typeof scanningStatus === 'undefined' || scanningStatus === 'disconnected' || scanningStatus === 'connecting')
			return { children: t('ns_common:actions.connect'), variant: 'default', icon: 'PlugZap' }
		if (scanningStatus === 'connected')
			return { children: t('ns_common:actions.disconnect'), variant: 'destructive', icon: 'Unplug' }
	}, [scanningStatus, i18n.language])

	const handleResetScanningAction = () => {
		queryClient.removeQueries({
			queryKey: [FP_ORDER_DETAIL_PROVIDE_TAG],
			exact: false,
			type: 'all'
		})
		queryClient.removeQueries({
			queryKey: [FP_EPC_LIST_PROVIDE_TAG],
			exact: false,
			type: 'all'
		})
		resetScanningAction()
	}

	useBrowserTabStatus({
		idleTime: INACTIVE_TIME,
		hiddenTime: INACTIVE_TIME,
		onIdle: () => {
			if (scanningStatus === 'connected') setScanningStatus('disconnected')
		},
		onInactive: () => {
			if (scanningStatus === 'connected') setScanningStatus('disconnected')
		},
		onResume: () => {
			if (previousStatus === 'connected')
				toast.custom(
					() => (
						<Div className='rounded-lg border bg-background p-4 shadow-lg'>
							<Typography variant='small' className='font-medium'>
								{t('ns_inoutbound:notification.browser_tab_resumed')} 🖐
							</Typography>
							<Typography variant='small' color='muted' className='block text-pretty'>
								{t('ns_inoutbound:notification.browser_tab_resumed_message')}
							</Typography>
							<Div className='mt-3 flex items-center justify-end gap-x-1 [&>button]:h-6 [&>button]:rounded-sm'>
								<Button
									variant='default'
									size='sm'
									onClick={() => {
										setScanningStatus('connecting')
										toast.dismiss('welcome-back')
									}}>
									{t('ns_common:actions.connect')}
								</Button>
								<Button variant='outline' size='sm' onClick={() => toast.dismiss('welcome-back')}>
									{t('ns_common:actions.dismiss')}
								</Button>
							</Div>
						</Div>
					),
					{ id: 'welcome-back', duration: 10000 }
				)
		}
	})

	return (
		<Div className='inline-grid grid-cols-2 items-stretch gap-x-2 *:w-full'>
			<Button variant='secondary' disabled={scanningStatus === 'connected'} onClick={handleResetScanningAction}>
				<Icon name='Redo' />
				{t('ns_common:actions.reset')}
			</Button>
			<Button onClick={handleToggleScanning} variant={scanningButtonProps.variant}>
				<Icon name={scanningButtonProps.icon} />
				{scanningButtonProps.children}
			</Button>
		</Div>
	)
}

export default ScannerActions
