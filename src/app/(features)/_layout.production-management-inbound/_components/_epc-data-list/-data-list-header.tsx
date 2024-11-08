import { Div, Icon, Select, SelectContent, SelectTrigger, SelectValue, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const DataListHeader: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative flex h-full items-center justify-between'>
			<Typography variant='h6' className='relative z-10 inline-flex items-center gap-x-2 px-2 text-center text-base'>
				<Icon name='ScanBarcode' size={20} />
				EPC Data
			</Typography>
			<Select>
				<SelectTrigger className='basis-1/2 bg-background'>
					<SelectValue placeholder='Select'></SelectValue>
				</SelectTrigger>
				<SelectContent></SelectContent>
			</Select>
		</Div>
	)
}

export default DataListHeader
