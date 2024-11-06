import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	ButtonProps,
	Div,
	HoverCard,
	HoverCardContent,
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
import { HoverCardTrigger } from '@radix-ui/react-hover-card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FP_EPC_LIST_PROVIDE_TAG, FP_ORDER_DETAIL_PROVIDE_TAG } from '../../_apis/rfid.api'
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

	const { data: tenants } = useQuery({
		queryKey: ['TENANCY'],
		queryFn: TenancyService.getTenantsByFactory,
		select: (response) => response.metadata
	})

	const queryClient = useQueryClient()

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
			<Div className='flex items-center justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2'>
				<Select
					value={connection}
					disabled={typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setConnection(value)}>
					<HoverCard openDelay={50} closeDelay={50}>
						<HoverCardTrigger asChild className='w-full basis-1/5 sm:basis-full md:basis-1/3 lg:basis-1/3'>
							<SelectTrigger>
								<Div className='flex flex-1 items-center gap-x-3'>
									<Icon name='Database' size={18} stroke='hsl(var(--primary))' />
									<SelectValue placeholder={'Select database'} />
								</Div>
							</SelectTrigger>
						</HoverCardTrigger>
						<HoverCardContent side={isSmallScreen ? 'top' : 'right'} align='start' sideOffset={8}>
							<Typography variant='small'>{t('ns_inoutbound:description.select_database')}</Typography>
						</HoverCardContent>
					</HoverCard>
					<SelectContent>
						<SelectGroup>
							{Array.isArray(tenants) &&
								tenants.map((item) => (
									<SelectItem key={item.id} value={item.id}>
										{item.host}
									</SelectItem>
								))}
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
						disabled={!connection}
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
