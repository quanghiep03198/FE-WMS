import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Typography } from '@/components/ui'
import { StatusIndicator } from '@/components/ui/@custom/status-indicator'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import ReaderSettingSheet from './reader-setting-sheet'

const PlaygroundHeader: React.FC = () => {
	const { connectionStatus, scannedEpcs } = useReaderPlaygroundStore('connectionStatus', 'scannedEpcs')
	const { t } = useTranslation()

	return (
		<Div className='flex items-center justify-between gap-x-2 p-2'>
			<Div className='inline-flex items-center gap-x-2 text-base'>
				<StatusIndicator
					state={Object.values(connectionStatus).every((value) => value) ? 'active' : 'fixing'}
					label={t('ns_inoutbound:counter_box.label')}
					className='ml-2'
					labelClassName='text-base after:content-[":"] ml-1 inline-flex items-center gap-x-1 font-medium'
				/>

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
