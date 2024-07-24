import { cn } from '@/common/utils/cn'
import {
	Button,
	ButtonProps,
	Div,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'
import { useMemoizedFn } from 'ahooks'
import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
	RFID_EPC_PROVIDE_TAG,
	useGetDatabaseConnnection,
	useSyncEpcOrderCodeMutation
} from '../_composables/-use-rfid-api'
import { usePageStore } from '../_contexts/-page.context'

type TScanningButtonProps = {
	children: string
	variant: ButtonProps['variant']
	icon: React.ComponentProps<typeof Icon>['name']
	disabled: boolean
}

const ScanningActions: React.FC = () => {
	const queryClient = useQueryClient()
	const { t, i18n } = useTranslation()
	const {
		scannedEPCs,
		scanningStatus,
		connection,
		setSelectedOrder,
		setScanningStatus,
		setConnection,
		handleToggleScanning,
		resetConnection,
		resetScanningStatus
	} = usePageStore()

	const { mutateAsync: syncOrderCodes } = useSyncEpcOrderCodeMutation()
	const { data: databases, isLoading } = useGetDatabaseConnnection()

	// Blocking navigation on reading EPC or unsave changes
	const { proceed, reset, status } = useBlocker({
		condition: scanningStatus === 'scanning'
	})

	const scanningButtonProps = useMemo<TScanningButtonProps>(() => {
		const disabled = scanningStatus === 'finished'

		switch (true) {
			case typeof scanningStatus === 'undefined' || scanningStatus === 'finished':
				return { children: t('ns_common:actions.start'), variant: 'secondary', icon: 'Play', disabled }
			case scanningStatus === 'scanning':
				return { children: t('ns_common:actions.stop'), variant: 'destructive', icon: 'Pause', disabled }

			case scanningStatus === 'stopped':
				return { children: t('ns_common:actions.continue'), variant: 'secondary', icon: 'Play', disabled }
		}
	}, [scanningStatus, i18n.language])

	const handleReset = useCallback(reset, [status])
	const handleProceed = useCallback(proceed, [status])

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') syncOrderCodes()
	}, [scanningStatus])

	const handleResetScanning = useMemoizedFn(() => {
		resetScanningStatus()
		resetConnection()
		queryClient.removeQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
	})

	const handleFinishScanning = useMemoizedFn(() => {
		setScanningStatus('finished')
		toast.info('Finished scanning EPCs')
	})

	return (
		<Fragment>
			<Div className='flex items-center justify-between'>
				<Select
					value={connection}
					disabled={isLoading || typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setConnection(value)}>
					<SelectTrigger className='w-full max-w-56'>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon
								name={isLoading ? 'LoaderCircle' : 'Database'}
								className={cn(isLoading && 'animate-[spin_1.5s_linear_infinite]')}
								size={18}
								stroke='hsl(var(--primary))'
							/>
							<SelectValue placeholder={'Select database'} />
						</Div>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{!isLoading && Array.isArray(databases) && databases.length > 0 ? (
								databases.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))
							) : (
								<SelectItem disabled value={null}>
									Select connection
								</SelectItem>
							)}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Div className='flex items-center justify-end gap-x-1'>
					<Button
						className='gap-x-2'
						size='sm'
						variant='outline'
						disabled={scanningStatus === 'scanning'}
						onClick={handleResetScanning}>
						<Icon name='Redo' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						size='sm'
						className='gap-x-2'
						disabled={scanningButtonProps.disabled || !connection}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}>
						<Icon name={scanningButtonProps.icon} fill='currentColor' size={14} />
						{scanningButtonProps.children}
					</Button>
					<Button
						className='gap-x-2'
						size='sm'
						disabled={scannedEPCs?.length === 0 || scanningStatus === 'finished'}
						onClick={handleFinishScanning}>
						<Icon name='Check' />
						{t('ns_common:actions.finish')}
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

export default ScanningActions
