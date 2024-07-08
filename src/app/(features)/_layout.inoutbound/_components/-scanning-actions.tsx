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
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PageContext } from '../_context/-page-context'
import { useQuery } from '@tanstack/react-query'
import { RFIDService } from '@/services/rfid.service'

const ScanningActions: React.FC = () => {
	const { data, scanningStatus, isScanningError, connection, setScanningStatus, setConnection } =
		useContext(PageContext)
	const { t, i18n } = useTranslation()

	const scanningButtonText = useMemo(() => {
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

	const { data: databases, isLoading } = useQuery({
		queryKey: ['DATABASE_COMPATIBILITY'],
		queryFn: RFIDService.getDatabaseCompatibility,
		select: (response) => response.metadata
	})

	return (
		<Div className='flex items-center justify-between'>
			<Select
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
						{Array.isArray(databases) && databases.map((item) => <SelectItem value={item}>{item}</SelectItem>)}
					</SelectGroup>
				</SelectContent>
			</Select>

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
					disabled={scanningStatus === 'finished' || isScanningError || !connection}
					onClick={() =>
						setScanningStatus((prev) => {
							if (typeof prev === 'undefined') return 'scanning'
							if (prev === 'stopped') return 'scanning'
							if (prev === 'scanning') return 'stopped'
						})
					}
					variant={scanningStatus === 'scanning' ? 'destructive' : 'secondary'}>
					<Icon name={scanningStatus === 'scanning' ? 'Pause' : 'Play'} fill='currentColor' size={14} />
					{scanningButtonText}
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
		</Div>
	)
}

export default ScanningActions
