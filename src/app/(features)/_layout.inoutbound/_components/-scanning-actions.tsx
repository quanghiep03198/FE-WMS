import {
	Button,
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
import { useBlocker } from '@tanstack/react-router'
import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetDatabaseConnnection, useSyncEpcOrderCodeMutation } from '../_composables/-use-rfid-api'
import { usePageStore } from '../_contexts/-page.context'

const ScanningActions: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { scannedEPCs, scanningStatus, connection, setScanningStatus, setConnection, handleToggleScanning } =
		usePageStore()

	const { mutateAsync: syncOrderCodes } = useSyncEpcOrderCodeMutation()
	const { data: databases, isLoading } = useGetDatabaseConnnection()

	// Blocking navigation on reading EPC or unsave changes
	const { proceed, reset, status } = useBlocker({
		condition: scanningStatus === 'scanning'
	})

	const scanningButtonText = useMemo(() => {
		switch (true) {
			case typeof scanningStatus === 'undefined' || scanningStatus === 'finished':
				return t('ns_common:actions.start')
			case scanningStatus === 'scanning':
				return t('ns_common:actions.stop')
			case scanningStatus === 'stopped':
				return t('ns_common:actions.continue')
		}
	}, [scanningStatus, i18n.language])

	const handleReset = useCallback(reset, [status])
	const handleProceed = useCallback(proceed, [status])

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') syncOrderCodes()
	}, [scanningStatus])

	return (
		<Fragment>
			<Div className='flex items-center justify-between'>
				<Select
					value={connection}
					disabled={isLoading || typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setConnection(value)}>
					<SelectTrigger className='w-full max-w-56'>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon name='Database' size={20} stroke='hsl(var(--primary))' />
							<SelectValue placeholder={isLoading ? 'Loading ...' : 'Select database'} />
						</Div>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{Array.isArray(databases) &&
								databases.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Div className='flex items-center justify-end gap-x-1'>
					<Button
						size='sm'
						className='gap-x-2'
						disabled={scanningStatus === 'finished' || !connection}
						onClick={() => handleToggleScanning()}
						variant={scanningStatus === 'scanning' ? 'destructive' : 'secondary'}>
						<Icon name={scanningStatus === 'scanning' ? 'Pause' : 'Play'} fill='currentColor' size={14} />
						{scanningButtonText}
					</Button>
					<Button
						className='gap-x-2'
						size='sm'
						disabled={scannedEPCs?.length === 0 || scanningStatus === 'finished'}
						onClick={() => {
							setScanningStatus('finished')
							toast.info('Finished scanning EPCs')
						}}>
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
