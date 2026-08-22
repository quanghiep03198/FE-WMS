import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@components/ui'
import { useTranslation } from 'react-i18next'
import type { StockFlow } from '../../constants/enums'
import { DataRestorationProvider } from '../../contexts/data-restoration-context'
import { SheetBody } from '../styled'
import RestorationDataActions from './data-restoration-actions'
import DataRestorationTable from './data-restoration-table'
import ArchivedEpcFilter from './filter-box'

type ArchivedRestorationSheetProps = {
	dataType: StockFlow
}

const DataRestorationSheet: React.FC<ArchivedRestorationSheetProps> = ({ dataType }) => {
	const { t } = useTranslation()

	return (
		<DataRestorationProvider>
			<Sheet>
				<SheetTrigger id='data-restoration-sheet-trigger' className='hidden' />
				<SheetContent className='max-w-xl gap-y-6'>
					<SheetHeader>
						<SheetTitle>{t('ns_inoutbound:titles.archived_restoration')}</SheetTitle>
						<SheetDescription>{t('ns_inoutbound:description.archived_restoration')}</SheetDescription>
					</SheetHeader>
					<SheetBody>
						<ArchivedEpcFilter stockFlow={dataType} />
						<DataRestorationTable dataType={dataType} />
					</SheetBody>
					<SheetFooter className='flex-col gap-y-2'>
						<RestorationDataActions stockFlow={dataType} />
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</DataRestorationProvider>
	)
}

export default DataRestorationSheet
