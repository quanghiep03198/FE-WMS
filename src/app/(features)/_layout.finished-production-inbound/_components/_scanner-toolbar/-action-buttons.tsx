import { Button, ButtonProps, Div, Icon } from '@/components/ui'
import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG } from '../../_apis/inbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

interface TScanningButtonProps extends Pick<ButtonProps, 'children' | 'variant'> {
	icon: React.ComponentProps<typeof Icon>['name']
}

const ScannerActions: React.FC = () => {
	const { t, i18n } = useTranslation()
	const queryClient = useQueryClient()
	const {
		scanningStatus,
		reset: resetScanningAction,
		handleToggleScanning
	} = usePageContext('scanningStatus', 'reset', 'handleToggleScanning')

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

	return (
		<Div className='inline-grid grid-cols-2 items-stretch gap-x-1 *:w-full'>
			<Button variant='secondary' disabled={scanningStatus === 'connected'} onClick={handleResetScanningAction}>
				<Icon name='Redo' role='img' />
				{t('ns_common:actions.reset')}
			</Button>
			<Button onClick={handleToggleScanning} variant={scanningButtonProps.variant}>
				<Icon role='img' name={scanningButtonProps.icon} />
				{scanningButtonProps.children}
			</Button>
		</Div>
	)
}

export default ScannerActions
