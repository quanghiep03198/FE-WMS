import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { Button, ButtonProps, Div, Icon } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
	const { user, isAuthenticated } = useAuth()
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const {
		scanningStatus,
		reset: resetScanningAction,
		setConnection,
		handleToggleScanning,
		reset: resetScanner
	} = usePageContext(
		'scanningStatus',
		'connection',
		'reset',
		'setScanningStatus',
		'setConnection',
		'handleToggleScanning',
		'reset'
	)

	const { data: tenant } = useQuery({
		queryKey: ['DEFAULT_TENANT', user.company_code],
		queryFn: TenancyService.getDefaultTenantByFactory,
		refetchOnMount: 'always',
		select: (response) => response.metadata
	})

	const queryClient = useQueryClient()
	const { searchParams } = useQueryParams({ process: ProducingProcessSuffix.HALF_FINISHED })

	useEffect(() => {
		if (tenant) setConnection(tenant?.id)
	}, [tenant])

	// Blocking navigation on reading EPC or unsave changes
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
			<Div className='grid grid-cols-12 gap-x-3 sm:grid-cols-1 sm:gap-y-3 md:grid-cols-1 md:gap-y-3'>
				<Div className='grid grid-cols-2 gap-1 sm:grid-cols-1 lg:col-span-5 xl:col-span-5 xxl:col-span-4'>
					<ProcessSelect />
					<OrderFilterSelect />
				</Div>

				<Div className='flex items-stretch justify-end gap-1 sm:order-first sm:justify-around md:order-first lg:col-span-7 xl:col-span-7 xxl:col-span-8'>
					<Button
						size={isSmallScreen ? 'lg' : 'default'}
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={handleResetScanningAction}
						className='basis-32 sm:basis-1/2 md:basis-1/2'>
						<Icon name='Redo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						size={isSmallScreen ? 'lg' : 'default'}
						disabled={!searchParams.process}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}
						className='basis-32 sm:basis-1/2 md:basis-1/2'>
						<Icon role='img' name={scanningButtonProps.icon} />
						{scanningButtonProps.children}
					</Button>
					<SettingPopover />
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
