import formatIntlNumber from '@common/utils/format-intl-number'
import { Div, Typography } from '@components/ui'
import { useReaderPlaygroundStore } from '../../contexts/rfid-reader-playground-context'
import PlaygroundStatusIndicator from './playground-status-indicator'
import ReaderSettingSheet from './reader-setting-sheet'

const PlaygroundHeader: React.FC = () => {
	const { scannedEpcs } = useReaderPlaygroundStore('connectionStatus', 'scannedEpcs')

	return (
		<Div className='flex items-center justify-between gap-x-2 p-2'>
			<Div className='inline-flex items-center gap-x-2 text-base'>
				<PlaygroundStatusIndicator />
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
