import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Button, ButtonProps, Div, Icon } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useQueryParams from '@/common/hooks/use-query-params'
import { PM_EPC_LIST_PROVIDE_TAG } from '../../_apis/rfid.api'
import { ProducingProcessSuffix } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'
import OrderFilterSelect from './-order-filter-select'
import ProcessSelect from './-process-select'
import SettingPopover from './-setting-popover'

interface TScanningButtonProps extends Pick<ButtonProps, 'children' | 'variant'> {
	icon: React.ComponentProps<typeof Icon>['name']
}

const ScannerToolbar: React.FC = () => {
	const { isAuthenticated } = useAuth()
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
	const { t, i18n } = useTranslation()
	const {
		scanningStatus,
		connection,
		reset: resetScanningAction,
		setConnection,
		handleToggleScanning
	} = usePageContext(
		'scanningStatus',
		'connection',
		'reset',
		'setScanningStatus',
		'setConnection',
		'handleToggleScanning'
	)

	const { data: tenant } = useQuery({
		queryKey: ['TENANCY'],
		queryFn: TenancyService.getDefaultTenantByFactory,
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})

	useEffect(() => {
		setConnection(tenant.id)
	}, [tenant])

	const queryClient = useQueryClient()
	const { searchParams, setParams } = useQueryParams({ process: ProducingProcessSuffix.HALF_FINISHED })

	// Blocking navigation on reading EPC or unsave changes
	const { proceed, reset, status } = useBlocker({
		condition: typeof scanningStatus !== 'undefined' && isAuthenticated
	})

	const scanningButtonProps = useMemo<TScanningButtonProps>(() => {
		if (typeof scanningStatus === 'undefined' || scanningStatus === 'disconnected' || scanningStatus === 'connecting')
			return { children: t('ns_common:actions.connect'), variant: 'default', icon: 'PlugZap' }
		if (scanningStatus === 'connected')
			return { children: t('ns_common:actions.disconnect'), variant: 'destructive', icon: 'Unplug' }
	}, [scanningStatus, i18n.language])

	const handleReset = useCallback(reset, [status])
	const handleProceed = useCallback(proceed, [status])

	const handleResetScanningAction = () => {
		queryClient.removeQueries({
			queryKey: [PM_EPC_LIST_PROVIDE_TAG],
			exact: false,
			type: 'all'
		})
		resetScanningAction()
	}

	return (
		<Fragment>
			<Div className='flex w-full items-stretch justify-between gap-x-6 gap-y-2 sm:flex-col sm:justify-stretch md:flex-col'>
				<Div className='flex flex-1 basis-full items-stretch gap-2 sm:flex-col'>
					<Div className='basis-64 sm:basis-full md:basis-1/2'>
						<ProcessSelect />
					</Div>
					<Div className='basis-64 sm:basis-full md:basis-1/2'>
						<OrderFilterSelect />
					</Div>
				</Div>
				<Div className='flex flex-1 basis-full items-stretch gap-x-1 lg:justify-end xl:justify-end'>
					<Button
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={handleResetScanningAction}
						className='basis-32 sm:basis-1/2 md:basis-full'>
						<Icon name='Redo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						disabled={!searchParams.process}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}
						className='basis-32 sm:basis-1/2 md:basis-full'>
						<Icon role='img' name={scanningButtonProps.icon} />
						{scanningButtonProps.children}
					</Button>
					<SettingPopover />
				</Div>
			</Div>
			<ConfirmDialog
				open={status === 'blocked'}
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
