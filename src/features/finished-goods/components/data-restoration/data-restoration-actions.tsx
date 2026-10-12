import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { SheetClose } from '@components/ui/sheet'

import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { StockFlow } from '../../constants/enums'
import { useDataRestorationContext } from '../../contexts/data-restoration-context'
import { useRestoreDeletedEpcsMutation } from '../../hooks/use-deleted-epc-request'

type RestorationDataActionsProps = {
	stockFlow: StockFlow
}

const RestorationDataActions: React.FC<RestorationDataActionsProps> = ({ stockFlow }) => {
	const { t } = useTranslation()
	const { selectedItems, removeAllItemsFromSet } = useDataRestorationContext('selectedItems', 'removeAllItemsFromSet')
	const { mutateAsync, isPending, isError } = useRestoreDeletedEpcsMutation(stockFlow)

	const handleRestoreArchivedEpcs = async () => {
		await mutateAsync(selectedItems.map((item) => item.epc))
		removeAllItemsFromSet()
	}

	return (
		<Fragment>
			<Button disabled={!selectedItems.length || isPending} size='lg' onClick={() => handleRestoreArchivedEpcs()}>
				{isPending && <Icon className='animate-spin' name='LoaderCircle' />}
				{isError ? t('ns_common:actions.retry') : t('ns_common:actions.restore')}
			</Button>
			<SheetClose asChild>
				<Button
					size='lg'
					variant='outline'
					onClick={() => {
						removeAllItemsFromSet()
					}}>
					{t('ns_common:actions.cancel')}
				</Button>
			</SheetClose>
		</Fragment>
	)
}

export default RestorationDataActions
