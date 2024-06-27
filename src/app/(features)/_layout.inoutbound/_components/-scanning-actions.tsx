import { Button, Div, Icon } from '@/components/ui'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PageContext } from '../_context/-page-context'

const ScanningActions: React.FC = () => {
	const { scanningStatus, isScanningError, setScanningStatus, data } = useContext(PageContext)
	const { t, i18n } = useTranslation()

	const readingButtonText = useMemo(() => {
		switch (true) {
			case typeof scanningStatus === 'undefined' || scanningStatus === 'finished':
				return t('ns_common:actions.start')
			case scanningStatus === 'scanning':
				return t('ns_common:actions.stop')
			case isScanningError && scanningStatus === 'stopped':
				return t('ns_common:status.stopped')
			case !isScanningError && scanningStatus === 'stopped':
				return t('ns_common:actions.continue')
		}
	}, [scanningStatus, i18n.language])

	return (
		<Div className='flex items-center justify-end gap-x-1'>
			{isScanningError && (
				<Button
					size='sm'
					className='w-full gap-x-2'
					variant='destructive'
					onClick={() => setScanningStatus(undefined)}>
					<Icon name='ListRestart' />
					{t('ns_common:actions.reset')}
				</Button>
			)}
			<Button
				size='sm'
				className='gap-x-2'
				disabled={scanningStatus === 'finished' || isScanningError}
				onClick={() =>
					setScanningStatus((prev) => {
						if (typeof prev === 'undefined') return 'scanning'
						if (prev === 'stopped') return 'scanning'
						if (prev === 'scanning') return 'stopped'
					})
				}
				variant={scanningStatus === 'scanning' ? 'destructive' : 'secondary'}>
				<Icon name={scanningStatus === 'scanning' ? 'Pause' : 'Play'} fill='currentColor' size={14} />
				{readingButtonText}
			</Button>
			<Button
				className='gap-x-2'
				size='sm'
				disabled={isScanningError || data.length == 0}
				onClick={() => {
					setScanningStatus('finished')
					toast.info('Finished scanning EPCs')
				}}>
				<Icon name='Check' />
				{t('ns_common:actions.finish')}
			</Button>
		</Div>
	)
}

export default ScanningActions
