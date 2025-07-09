import { cn } from '@/common/utils/cn'
import {
	buttonVariants,
	Icon,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ArchivedEpcList from './archived-epc-list'
import ArchivedListActions from './archived-list-actions'
import ArchivedEpcFilter from './filter-box'
import { SheetBody } from './styled'

const ArchivedRestorationSheet: React.FC = () => {
	const { t } = useTranslation()
	const [sheetOpen, setSheetOpen] = useState<boolean>(false)

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
			<SheetTrigger className={cn(buttonVariants({ variant: 'ghost' }))} onClick={() => setSheetOpen(!sheetOpen)}>
				<Icon name='Archive' size={18} /> {t('ns_common:actions.archived')}
			</SheetTrigger>
			<SheetContent className='max-w-xl gap-y-6'>
				<SheetHeader>
					<SheetTitle>{t('ns_inoutbound:titles.archived_restoration')}</SheetTitle>
					<SheetDescription>{t('ns_inoutbound:description.archived_restoration')}</SheetDescription>
				</SheetHeader>
				<SheetBody>
					<ArchivedEpcFilter />
					<ArchivedEpcList data-open={sheetOpen} />
				</SheetBody>
				<SheetFooter className='flex-col gap-y-2'>
					<ArchivedListActions />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export default ArchivedRestorationSheet
