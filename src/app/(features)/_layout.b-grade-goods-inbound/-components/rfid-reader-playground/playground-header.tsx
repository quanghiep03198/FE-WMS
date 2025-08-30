import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import ReaderSettingSheet from './reader-setting-sheet'

const PlaygroundHeader: React.FC = () => {
	const { connectionStatus, scannedEpcs } = useReaderPlaygroundStore('connectionStatus', 'scannedEpcs')
	const { t } = useTranslation()

	return (
		<Div className='flex h-[var(--playground-header-height)] items-center justify-between gap-x-2 p-2'>
			<Div className='inline-flex items-center gap-x-2 text-base'>
				<Typography className='ml-2 inline-flex items-center gap-x-2 font-medium'>
					<Icon
						name='Dot'
						className={cn(
							'scale-[0.55] rounded-full ring-8',
							Object.values(connectionStatus).every((value) => value)
								? 'bg-success fill-success stroke-success ring-success/30'
								: 'bg-warning fill-warning stroke-warning ring-warning/30'
						)}
					/>
					{t('ns_inoutbound:counter_box.label')}:
				</Typography>
				<Typography className='inline-flex gap-x-1 text-lg font-semibold'>
					{formatIntlNumber(scannedEpcs.length)}
					<Typography as='small' variant='small' className='text-xs font-medium'>
						prs
					</Typography>
				</Typography>
			</Div>
			<ReaderSettingSheet />
		</Div>
	)
}

export default PlaygroundHeader
