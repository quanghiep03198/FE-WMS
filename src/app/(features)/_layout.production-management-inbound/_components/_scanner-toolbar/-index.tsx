import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	ButtonProps,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
	FP_EPC_LIST_PROVIDE_TAG,
	FP_ORDER_DETAIL_PROVIDE_TAG
} from '@/app/(features)/_layout.finished-production-inoutbound/_apis/rfid.api'
import useQueryParams from '@/common/hooks/use-query-params'
import { ProducingProcessSuffix } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'

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
		console.log(tenant)
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
		<Fragment>
			<Div className='mb-4 flex w-full items-center justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2'>
				<Select
					value={searchParams.process}
					disabled={typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setParams({ process: value })}>
					<HoverCard openDelay={50}>
						<HoverCardTrigger asChild>
							<SelectTrigger className='basis-1/5 sm:basis-full md:basis-1/3'>
								<Div className='flex flex-1 items-center gap-x-3'>
									<Icon name='Workflow' size={18} stroke='hsl(var(--primary))' />
									<SelectValue placeholder='Select process' />
								</Div>
							</SelectTrigger>
						</HoverCardTrigger>
						<HoverCardContent side='right' align='start'>
							<Typography variant='small'>
								Lựa chọn công đoạn quét tem tương ứng với các bộ phận đương nhiệm
							</Typography>
						</HoverCardContent>
					</HoverCard>
					<SelectContent>
						<SelectGroup>
							<SelectItem
								key={ProducingProcessSuffix.HALF_FINISHED}
								value={ProducingProcessSuffix.HALF_FINISHED}>
								{t('ns_inoutbound:rfid_process.production_management_inbound')}
							</SelectItem>
							<SelectItem key={ProducingProcessSuffix.CUTTING} value={ProducingProcessSuffix.CUTTING}>
								{t('ns_inoutbound:rfid_process.cutting_inbound')}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				<Div className='inline-grid grid-cols-2 items-stretch gap-x-1 *:w-full'>
					<Button
						size={isSmallScreen ? 'default' : 'sm'}
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={handleResetScanningAction}>
						<Icon name='Redo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						size={isSmallScreen ? 'default' : 'sm'}
						disabled={!searchParams.process}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}>
						<Icon role='img' name={scanningButtonProps.icon} />
						{scanningButtonProps.children}
					</Button>
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
