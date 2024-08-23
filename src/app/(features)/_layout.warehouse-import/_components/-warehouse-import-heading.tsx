import { Div, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import ImportDataListDialog from './-warehouse-import-datalist-dialog'

type Props = {}

const ProductionImportHeading = (props: Props) => {
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<Div className='space-y-1'>
				<Typography variant='h6'>Production Import List</Typography>
				<Typography variant='small' color='muted'>
					Manage list of warehouse production import
				</Typography>
			</Div>
			<ImportDataListDialog />
		</Div>
	)
}

export default ProductionImportHeading
