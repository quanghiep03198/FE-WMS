import { RFID_READER_HOSTS } from '@/common/constants/constants'
import Regex from '@/common/constants/regex'
import { useAuth } from '@/common/hooks/use-auth'
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
import { pick } from 'lodash'
import React, { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

interface TScanningButtonProps extends Pick<ButtonProps, 'children' | 'variant'> {
	icon: React.ComponentProps<typeof Icon>['name']
}

const ScanningActions: React.FC = () => {
	const { user, isAuthenticated } = useAuth()
	const queryClient = useQueryClient()
	const { t, i18n } = useTranslation()
	const {
		scanningStatus,
		connection,
		reset: resetScanningAction,
		setConnection,
		handleToggleScanning
	} = usePageContext((state) =>
		pick(state, [
			'scanningStatus',
			'connection',
			'reset',
			'setScanningStatus',
			'setConnection',
			'handleToggleScanning'
		])
	)

	const rfidReaderHosts = useMemo(() => {
		switch (true) {
			case Regex.VIETNAM_FACTORY_CODE.test(user?.company_code):
				return RFID_READER_HOSTS.VI
			case Regex.CAMBODIA_FACTORY_CODE.test(user?.company_code):
				return RFID_READER_HOSTS.KM
			// * Add more case if there still have other reader hosts
			default:
				return []
		}
	}, [user?.company_code])

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

	return (
		<Fragment>
			<Div className='flex items-center justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2'>
				<Select
					value={connection}
					disabled={typeof scanningStatus !== 'undefined'}
					onValueChange={(value) => setConnection(value)}>
					<SelectTrigger className='w-full max-w-56 sm:max-w-full'>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon name='Database' size={18} stroke='hsl(var(--primary))' />
							<SelectValue placeholder={'Select database'} />
						</Div>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{rfidReaderHosts.map((item) => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Div className='grid grid-cols-2 items-center gap-x-1 *:w-full'>
					<Button
						className='gap-x-2'
						size='sm'
						variant='secondary'
						disabled={scanningStatus === 'connected'}
						onClick={() => resetScanningAction()}>
						<Icon name='Redo' />
						{t('ns_common:actions.reset')}
					</Button>
					<Button
						size='sm'
						className='gap-x-2'
						disabled={!connection}
						onClick={handleToggleScanning}
						variant={scanningButtonProps.variant}>
						<Icon name={scanningButtonProps.icon} fill='currentColor' size={14} />
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

export default ScanningActions
