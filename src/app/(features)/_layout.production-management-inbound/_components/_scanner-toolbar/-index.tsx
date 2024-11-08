import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	ButtonProps,
	buttonVariants,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
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

import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { PM_EPC_LIST_PROVIDE_TAG } from '../../_apis/rfid.api'
import { ProducingProcessSuffix } from '../../_constants/index.const'
import { usePageContext } from '../../_contexts/-page-context'
import FullscreenSwitch from './-fullscreen-switch'
import PollingIntervalSelector from './-polling-duration-selector'

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
			<Div className='flex w-full items-start justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-6'>
				<Select
					value={searchParams.process}
					disabled={typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setParams({ process: value })}>
					<HoverCard openDelay={50} closeDelay={50}>
						<HoverCardTrigger asChild>
							<SelectTrigger className='basis-56 sm:basis-full'>
								<Div className='flex flex-1 items-center gap-x-3'>
									<Icon name='Workflow' size={18} stroke='hsl(var(--primary))' />
									<SelectValue placeholder='Select process' className='line-clamp-1' />
								</Div>
							</SelectTrigger>
						</HoverCardTrigger>
						<HoverCardContent side='left' align='start'>
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
				<Div className='flex flex-1 items-stretch justify-end gap-x-1'>
					<Button
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={handleResetScanningAction}
						className='basis-32 sm:basis-1/2'>
						<Icon name='Redo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						disabled={!searchParams.process}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}
						className='basis-32 sm:basis-1/2'>
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

const SettingPopover: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Popover>
			<PopoverTrigger className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }))}>
				<Icon name='Settings' />
			</PopoverTrigger>
			<PopoverContent side='bottom' align='end' className='min-w-96 space-y-4 @container'>
				<Div className='space-y-1'>
					<Typography variant='h6' className='text-lg'>
						{t('ns_common:navigation.settings')}
					</Typography>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:scanner_setting.adjust_setting_description')}
					</Typography>
				</Div>
				<PollingIntervalSelector />
				<FullscreenSwitch />
			</PopoverContent>
		</Popover>
	)
}

export default ScannerToolbar
