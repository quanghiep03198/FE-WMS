import { buttonVariants, Div, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import DataRestorationSheet from '../../../-components/shared'
import { RFIDDataType } from '../../../-constants'
import { DataRestorationProvider } from '../../../-contexts/data-sheet-context'

const DataRestoration: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.data_restoration')}
			</Typography>

			<Div className='flex min-h-24 items-start justify-between rounded-md border p-4'>
				<Div className='text-pretty leading-none'>
					<Typography variant='small' as='h5' className='mb-1 font-medium'>
						{t('ns_inoutbound:scanner_setting.restore_deleted_epcs')}
					</Typography>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:scanner_setting.data_restoration_note')}
					</Typography>
				</Div>
				<DataRestorationProvider>
					<label
						role='button'
						className={buttonVariants({ variant: 'outline', size: 'sm' })}
						htmlFor='data-restoration-sheet-trigger'>
						{t('ns_common:actions.open')}
					</label>
					<DataRestorationSheet dataType={RFIDDataType.INBOUND} />
				</DataRestorationProvider>
			</Div>
		</Div>
	)
}

export default DataRestoration
