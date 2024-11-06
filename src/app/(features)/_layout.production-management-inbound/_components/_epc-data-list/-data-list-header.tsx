import { Div, Icon, Typography } from '@/components/ui'

const DataListHeader: React.FC = () => {
	return (
		<Div className='relative flex h-full items-center'>
			<Typography variant='h6' className='relative z-10 inline-flex items-center gap-x-2 px-2 text-center text-base'>
				<Icon name='ScanBarcode' size={20} />
				EPC Data
			</Typography>
		</Div>
	)
}

export default DataListHeader
