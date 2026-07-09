import { Button, Icon, SheetClose } from '@/components/ui'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useDataRestorationContext } from '../../-contexts/data-sheet-context'

import type { RFIDDataType } from '../../-constants'
import { useRestoreEpcMutation } from '../../-hooks/use-data-restoration-asm'

type RestorationDataActionsProps = {
	dataType: RFIDDataType
}

const RestorationDataActions: React.FC<RestorationDataActionsProps> = ({ dataType }) => {
	const { t } = useTranslation()
	const { selectedItems, removeAllItemsFromSet } = useDataRestorationContext('selectedItems', 'removeAllItemsFromSet')
	const { mutateAsync, isPending, isError } = useRestoreEpcMutation(dataType)

	const handleRestoreArchivedEpcs = async () => {
		const id = toast.loading(t('ns_common:notification.processing_request'))

		try {
			await mutateAsync(selectedItems.map((item) => item.epc))
			toast.success(t('ns_common:notification.success'), { id })
			removeAllItemsFromSet()
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<Fragment>
			<Button size='lg' disabled={!selectedItems.length || isPending} onClick={() => handleRestoreArchivedEpcs()}>
				{isPending && <Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />}
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
