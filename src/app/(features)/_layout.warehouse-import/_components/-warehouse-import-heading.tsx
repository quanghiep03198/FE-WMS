import { Div } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../_components/shared/-page-header'
import ImportDataListDialog from './-import-order-datalist-dialog'

type Props = {}

const ProductionImportHeading = (props: Props) => {
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<PageHeader className='space-y-1'>
				<PageTitle>Production Import List</PageTitle>
				<PageDescription>Manage list of warehouse production import</PageDescription>
			</PageHeader>
			<ImportDataListDialog />
		</Div>
	)
}

export default ProductionImportHeading
