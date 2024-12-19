import { useAuth } from '@/common/hooks/use-auth'
import { Button, ButtonProps, Div, Icon } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import TenancySelect from './-tenancy-select'

interface TScanningButtonProps extends Pick<ButtonProps, 'children' | 'variant'> {
	icon: React.ComponentProps<typeof Icon>['name']
}

const ScannerToolbar: React.FC = () => {
	const { isAuthenticated } = useAuth()

	const { t, i18n } = useTranslation()
	const {
		scanningStatus,
		connection,
		reset: resetScanningAction,
		handleToggleScanning
	} = usePageContext(
		'scanningStatus',
		'connection',
		'reset',
		'setScanningStatus',
		'setConnection',
		'handleToggleScanning',
		'reset'
	)

	const queryClient = useQueryClient()

	// * Blocking navigation on reading EPC or unsave changes
	const blocker = useBlocker({
		condition: typeof scanningStatus !== 'undefined' && isAuthenticated
	})

	const scanningButtonProps = useMemo<TScanningButtonProps>(() => {
		if (typeof scanningStatus === 'undefined' || scanningStatus === 'disconnected' || scanningStatus === 'connecting')
			return { children: t('ns_common:actions.connect'), variant: 'default', icon: 'PlugZap' }
		if (scanningStatus === 'connected')
			return { children: t('ns_common:actions.disconnect'), variant: 'destructive', icon: 'Unplug' }
	}, [scanningStatus, i18n.language])

	const handleReset = useCallback(blocker.reset, [blocker.status])
	const handleProceed = useCallback(blocker.proceed, [blocker.status])

	const handleResetScanningAction = useCallback(() => {
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
	}, [])

	return (
		<Fragment>
			<Div className='flex items-center justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2'>
				<TenancySelect />

				<Div className='inline-grid grid-cols-2 items-stretch gap-x-1 *:w-full'>
					<Button
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={handleResetScanningAction}>
						<Icon name='Redo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button disabled={!connection} onClick={handleToggleScanning} variant={scanningButtonProps.variant}>
						<Icon role='img' name={scanningButtonProps.icon} />
						{scanningButtonProps.children}
					</Button>
				</Div>
			</Div>
			<ConfirmDialog
				open={blocker.status === 'blocked'}
				onOpenChange={handleReset}
				title={t('ns_inoutbound:notification.navigation_blocked_message')}
				description={t('ns_inoutbound:notification.navigation_blocked_caption')}
				onConfirm={handleProceed}
				onCancel={handleReset}
			/>
		</Fragment>
	)
}

export default ScannerToolbar
